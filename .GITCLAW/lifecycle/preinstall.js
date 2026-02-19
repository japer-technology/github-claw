/**
 * preinstall.js — Adds a 👀 reaction to signal that the agent is working.
 *
 * Runs *before* dependency installation so the user sees immediate
 * feedback. The reaction ID is persisted to `/tmp/reaction-state.json`
 * so that `main.js` can remove it when the run completes.
 */

import { readFileSync, writeFileSync } from "fs";
import { spawnSync } from "child_process";

// --- Read GitHub Actions event context --------------------------------
const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf-8"));
const eventName = process.env.GITHUB_EVENT_NAME;
const repo = process.env.GITHUB_REPOSITORY;
const issueNumber = event.issue.number;

/** Thin wrapper around the GitHub CLI that returns trimmed stdout. */
function gh(...args) {
  const result = spawnSync("gh", args, { encoding: "utf-8", stdio: ["inherit", "pipe", "inherit"] });
  if (result.error) throw result.error;
  return (result.stdout ?? "").trim();
}

// --- Add 👀 reaction --------------------------------------------------
let reactionId = null;
let reactionTarget = "issue";
let commentId = null;

try {
  if (eventName === "issue_comment") {
    commentId = event.comment.id;
    reactionId = gh(
      "api", `repos/${repo}/issues/comments/${commentId}/reactions`,
      "-f", "content=eyes", "--jq", ".id"
    );
    reactionTarget = "comment";
  } else {
    reactionId = gh(
      "api", `repos/${repo}/issues/${issueNumber}/reactions`,
      "-f", "content=eyes", "--jq", ".id"
    );
  }
} catch (e) {
  console.error("Failed to add reaction:", e);
}

// --- Persist state for main.js cleanup --------------------------------
// Write reaction state so main.js can clean it up in its `finally` block.
writeFileSync("/tmp/reaction-state.json", JSON.stringify({
  reactionId,
  reactionTarget,
  commentId,
  issueNumber,
  repo,
}));
