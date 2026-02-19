# .GITCLAW/lifecycle

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/gitclaw/main/.GITCLAW/logo.png" alt="GitClaw" width="500">
  </picture>
</p>

Runtime scripts that power the gitclaw agent inside GitHub Actions.

## Files

| File | Purpose |
|------|---------|
| `preinstall.js` | Adds a 👀 reaction to the triggering issue/comment immediately on workflow start, signalling that the agent is working. Persists reaction state to `/tmp/reaction-state.json` for cleanup. |
| `main.js` | Core orchestrator: fetches the issue, resolves or creates a conversation session, runs the `pi` agent, commits state changes, and posts the agent's reply as an issue comment. |

## How they run

These scripts are invoked by the GitHub Actions workflow installed at `.github/workflows/agent.yml`. They require Node.js 20+ and the dependencies from `.GITCLAW/package.json` to be installed (`npm ci` from `.GITCLAW/`).

See [docs/ANALYSIS-WHAT.md](../docs/ANALYSIS-WHAT.md) for a full end-to-end walkthrough.
