# ♻️ Reinstall GitClaw

[← Back to Help](README.md)

---

Reset or upgrade an existing GitClaw installation. Use this when you want a fresh start, need to update to a newer version, or want to fix a broken installation.

## When to Reinstall

- **Upgrading** — a newer version of GitClaw is available with new features or fixes
- **Broken state** — session files or configuration got corrupted
- **Fresh start** — you want to clear all conversation history and start over
- **Workflow changes** — the workflow template has been updated upstream

## Upgrade — Preserve Configuration and History

To upgrade GitClaw while keeping your existing configuration, personality, and conversation history:

### 1. Back up your customizations

```bash
# Save your agent identity
cp .github-claw/AGENTS.md /tmp/AGENTS.md.bak

# Save your LLM settings
cp .github-claw/.pi/settings.json /tmp/settings.json.bak

# Save your system prompt (if customized)
cp .github-claw/.pi/APPEND_SYSTEM.md /tmp/APPEND_SYSTEM.md.bak
```

### 2. Replace the `.github-claw` folder

Remove the old folder and copy in the new version:

```bash
rm -rf .github-claw
# Copy the new .github-claw folder from the latest release
```

### 3. Restore your customizations

```bash
cp /tmp/AGENTS.md.bak .github-claw/AGENTS.md
cp /tmp/settings.json.bak .github-claw/.pi/settings.json
cp /tmp/APPEND_SYSTEM.md.bak .github-claw/.pi/APPEND_SYSTEM.md
```

### 4. Run the installer and install dependencies

```bash
bun .github-claw/install/github-claw-INSTALLER.ts
cd .github-claw && bun install
```

> The installer never overwrites existing files — it only creates missing ones. This means your existing `github-claw-WORKFLOW-AGENT.yml` workflow will remain as-is. If the workflow template has changed, delete `.github/workflows/github-claw-WORKFLOW-AGENT.yml` before running the installer to get the latest version.

### 5. Commit and push

```bash
git add -A
git commit -m "Upgrade gitclaw"
git push
```

## Clean Reinstall — Start Fresh

To completely reset GitClaw, including all conversation history:

### 1. Remove everything

```bash
rm -rf .github-claw
rm -f .github/workflows/github-claw-WORKFLOW-AGENT.yml
rm -f .github/ISSUE_TEMPLATE/hatch.md
```

### 2. Copy in a fresh `.github-claw` folder

Copy the `.github-claw` folder from the latest release into your repo root.

### 3. Run the full installation

```bash
bun .github-claw/install/github-claw-INSTALLER.ts
cd .github-claw && bun install
```

### 4. Reconfigure

- Add your API key secret in **Settings → Secrets and variables → Actions** (if not already present)
- Edit `.github-claw/.pi/settings.json` to set your preferred provider and model (see [Configure](configure.md))

### 5. Commit and push

```bash
git add -A
git commit -m "Reinstall gitclaw"
git push
```

## Fixing a Broken Workflow

If only the GitHub Actions workflow is broken or outdated:

```bash
# Remove the old workflow
rm .github/workflows/github-claw-WORKFLOW-AGENT.yml

# Re-run the installer to regenerate it from the template
bun .github-claw/install/github-claw-INSTALLER.ts

git add -A
git commit -m "Regenerate gitclaw workflow"
git push
```

## Resetting Session State Only

If you want to clear conversation history without reinstalling:

```bash
rm -rf .github-claw/state/sessions/*
rm -rf .github-claw/state/issues/*

git add -A
git commit -m "Clear gitclaw session history"
git push
```

The agent will start fresh conversations for all issues going forward.

## See Also

- [🔧 Install](install.md) — first-time installation guide
- [🗑️ Uninstall](uninstall.md) — complete removal
- [⚙️ Configure](configure.md) — customize after reinstalling
