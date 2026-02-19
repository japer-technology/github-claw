import { existsSync, mkdirSync, cpSync, readFileSync, writeFileSync, appendFileSync } from "fs";
import { resolve } from "path";

const gitclawDir = import.meta.dir;
const repoRoot = resolve(gitclawDir, "..");

function ensureDir(dir: string) {
  mkdirSync(dir, { recursive: true });
}

function copyIfMissing(src: string, dest: string, label: string) {
  if (existsSync(dest)) {
    console.log(`  ⏭  ${label} already exists, skipping`);
  } else {
    cpSync(src, dest, { recursive: true });
    console.log(`  ✅ ${label} installed`);
  }
}

console.log("🔧 Installing gitclaw into this repository...\n");

// 1. Install workflow
console.log("Workflows:");
ensureDir(resolve(repoRoot, ".github", "workflows"));
copyIfMissing(
  resolve(gitclawDir, "workflows", "agent.yml"),
  resolve(repoRoot, ".github", "workflows", "agent.yml"),
  ".github/workflows/agent.yml"
);

// 2. Install issue template
console.log("\nIssue templates:");
ensureDir(resolve(repoRoot, ".github", "ISSUE_TEMPLATE"));
copyIfMissing(
  resolve(gitclawDir, "issue-templates", "hatch.md"),
  resolve(repoRoot, ".github", "ISSUE_TEMPLATE", "hatch.md"),
  ".github/ISSUE_TEMPLATE/hatch.md"
);

// 3. Install .pi/ config at repo root (required by pi agent)
console.log("\nAgent config:");
copyIfMissing(
  resolve(gitclawDir, ".pi"),
  resolve(repoRoot, ".pi"),
  ".pi/"
);

// 4. Install AGENTS.md at repo root (referenced by pi agent)
copyIfMissing(
  resolve(gitclawDir, "AGENTS.md"),
  resolve(repoRoot, "AGENTS.md"),
  "AGENTS.md"
);

// 5. Ensure .gitattributes has memory.log merge strategy
console.log("\nGit config:");
const gitattributes = resolve(repoRoot, ".gitattributes");
const mergeRule = "memory.log merge=union";
if (existsSync(gitattributes)) {
  const content = readFileSync(gitattributes, "utf-8");
  if (!content.includes(mergeRule)) {
    appendFileSync(gitattributes, `\n${mergeRule}\n`);
    console.log("  ✅ Added memory.log merge strategy to .gitattributes");
  } else {
    console.log("  ⏭  .gitattributes already configured");
  }
} else {
  writeFileSync(gitattributes, `${mergeRule}\n`);
  console.log("  ✅ Created .gitattributes with memory.log merge strategy");
}

// 6. Ensure .gitignore has node_modules
const gitignore = resolve(repoRoot, ".gitignore");
if (existsSync(gitignore)) {
  const content = readFileSync(gitignore, "utf-8");
  if (!content.includes("node_modules")) {
    appendFileSync(gitignore, "\nnode_modules/\n");
    console.log("  ✅ Added node_modules/ to .gitignore");
  } else {
    console.log("  ⏭  .gitignore already has node_modules");
  }
} else {
  writeFileSync(gitignore, "node_modules/\n");
  console.log("  ✅ Created .gitignore with node_modules/");
}

console.log("\n✨ gitclaw installed!\n");
console.log("Next steps:");
console.log("  1. Add ANTHROPIC_API_KEY to Settings → Secrets and variables → Actions");
console.log("  2. Run: cd .GITCLAW && bun install");
console.log("  3. Commit and push the changes");
console.log("  4. Open an issue to start chatting with the agent\n");
