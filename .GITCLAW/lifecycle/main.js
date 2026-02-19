/**
 * main.js — Core agent orchestrator for gitclaw.
 *
 * Lifecycle:
 *   1. Fetch issue title/body from GitHub.
 *   2. Resolve (or create) a conversation session for this issue.
 *   3. Run the `pi` coding agent with the user's prompt.
 *   4. Extract the assistant's final text reply.
 *   5. Commit session state and any repo changes back to git.
 *   6. Post the reply as a comment on the originating issue.
 *   7. Remove the 👀 reaction that `preinstall.js` added.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { spawnSync, spawn } from "child_process";

// --- Paths and event context ------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));
const gitclawDir = resolve(__dirname, "..");
const stateDir = resolve(gitclawDir, "state");
const issuesDir = resolve(stateDir, "issues");
const sessionsDir = resolve(stateDir, "sessions");

/** Relative path used as a CLI arg for `pi` (must be repo-root-relative). */
const sessionsDirRelative = ".GITCLAW/state/sessions";

const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf-8"));
const eventName = process.env.GITHUB_EVENT_NAME;
const repo = process.env.GITHUB_REPOSITORY;
const defaultBranch = event.repository?.default_branch ?? "main";
const issueNumber = event.issue.number;

// --- Helpers ----------------------------------------------------------

/** Spawn a subprocess, capture stdout, and return the exit code. */
function run(cmd) {
  const result = spawnSync(cmd[0], cmd.slice(1), {
    encoding: "utf-8",
    stdio: ["inherit", "pipe", "inherit"],
  });
  if (result.error) throw result.error;
  return { exitCode: result.status ?? 0, stdout: (result.stdout ?? "").trim() };
}

/** Convenience wrapper: run `gh <args>` and return trimmed stdout. */
function gh(...args) {
  return run(["gh", ...args]).stdout;
}

// --- Restore reaction state from preinstall ---------------------------
// `preinstall.js` persists the reaction ID so we can clean it up later
// in the `finally` block, even if the agent run itself fails.
const reactionState = existsSync("/tmp/reaction-state.json")
  ? JSON.parse(readFileSync("/tmp/reaction-state.json", "utf-8"))
  : null;

try {
  // --- Fetch issue title and body -------------------------------------
  const title = gh("issue", "view", String(issueNumber), "--json", "title", "--jq", ".title");
  const body = gh("issue", "view", String(issueNumber), "--json", "body", "--jq", ".body");

  // --- Resolve or create session mapping ------------------------------
  mkdirSync(issuesDir, { recursive: true });
  mkdirSync(sessionsDir, { recursive: true });

  let mode = "new";
  let sessionPath = "";
  const mappingFile = resolve(issuesDir, `${issueNumber}.json`);

  if (existsSync(mappingFile)) {
    const mapping = JSON.parse(readFileSync(mappingFile, "utf-8"));
    if (existsSync(mapping.sessionPath)) {
      mode = "resume";
      sessionPath = mapping.sessionPath;
      console.log(`Found existing session: ${sessionPath}`);
    } else {
      console.log("Mapped session file missing, starting fresh");
    }
  } else {
    console.log("No session mapping found, starting fresh");
  }

  // --- Configure git identity ------------------------------------------
  run(["git", "config", "user.name", "gitclaw[bot]"]);
  run(["git", "config", "user.email", "gitclaw[bot]@users.noreply.github.com"]);

  // --- Build prompt from event context --------------------------------
  let prompt;
  if (eventName === "issue_comment") {
    prompt = event.comment.body;
  } else {
    prompt = `${title}\n\n${body}`;
  }

  // --- Run the pi agent ------------------------------------------------
  // Pipe output through `tee` so we get both a live log and a persisted
  // copy at `/tmp/agent-raw.jsonl` for post-processing.
  const piBin = resolve(gitclawDir, "node_modules", ".bin", "pi");
  const piArgs = [piBin, "--mode", "json", "--session-dir", sessionsDirRelative, "-p", prompt];
  if (mode === "resume" && sessionPath) {
    piArgs.push("--session", sessionPath);
  }

  await new Promise((resolve, reject) => {
    const pi = spawn(piArgs[0], piArgs.slice(1), { stdio: ["inherit", "pipe", "ignore"] });
    const tee = spawn("tee", ["/tmp/agent-raw.jsonl"], { stdio: [pi.stdout, "inherit", "inherit"] });
    tee.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`tee exited with code ${code}`))));
    pi.on("error", reject);
    tee.on("error", reject);
  });

  // --- Extract final assistant text ------------------------------------
  const agentText = await new Promise((resolve, reject) => {
    const tac = spawn("tac", ["/tmp/agent-raw.jsonl"], { stdio: ["inherit", "pipe", "inherit"] });
    const jq = spawn(
      "jq",
      ["-r", "-s", '[ .[] | select(.type == "message_end") ] | .[0].message.content[] | select(.type == "text") | .text'],
      { stdio: [tac.stdout, "pipe", "inherit"] }
    );
    const chunks = [];
    jq.stdout.on("data", (chunk) => chunks.push(chunk));
    jq.on("close", () => resolve(Buffer.concat(chunks).toString().trim()));
    jq.on("error", reject);
    tac.on("error", reject);
  });

  // --- Determine latest session file -----------------------------------
  const { stdout: latestSession } = run([
    "bash", "-c", `ls -t ${sessionsDirRelative}/*.jsonl 2>/dev/null | head -1`,
  ]);

  // --- Persist issue → session mapping ---------------------------------
  if (latestSession) {
    writeFileSync(
      mappingFile,
      JSON.stringify({
        issueNumber,
        sessionPath: latestSession,
        updatedAt: new Date().toISOString(),
      }, null, 2) + "\n"
    );
    console.log(`Saved mapping: issue #${issueNumber} -> ${latestSession}`);
  } else {
    console.log("Warning: no session file found to map");
  }

  // --- Commit and push state changes -----------------------------------
  run(["git", "add", "-A"]);
  const { exitCode } = run(["git", "diff", "--cached", "--quiet"]);
  if (exitCode !== 0) {
    run(["git", "commit", "-m", `gitclaw: work on issue #${issueNumber}`]);
  }

  for (let i = 1; i <= 3; i++) {
    const push = run(["git", "push", "origin", `HEAD:${defaultBranch}`]);
    if (push.exitCode === 0) break;
    console.log(`Push failed, rebasing and retrying (${i}/3)...`);
    run(["git", "pull", "--rebase", "origin", defaultBranch]);
  }

  // --- Post reply as issue comment -------------------------------------
  const commentBody = agentText.slice(0, 60000);
  gh("issue", "comment", String(issueNumber), "--body", commentBody);

} finally {
  // --- Guaranteed cleanup: remove 👀 reaction -------------------------
  if (reactionState?.reactionId) {
    try {
      const { reactionId, reactionTarget, commentId } = reactionState;
      if (reactionTarget === "comment" && commentId) {
        gh("api", `repos/${repo}/issues/comments/${commentId}/reactions/${reactionId}`, "-X", "DELETE");
      } else {
        gh("api", `repos/${repo}/issues/${issueNumber}/reactions/${reactionId}`, "-X", "DELETE");
      }
    } catch (e) {
      console.error("Failed to remove reaction:", e);
    }
  }
}
