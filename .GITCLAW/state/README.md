# .GITCLAW/state

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/gitclaw/main/.GITCLAW/logo.png" alt="GitClaw" width="500">
  </picture>
</p>

Persistent state storage for the gitclaw agent. All state is committed to git, giving the agent long-term memory across sessions.

## Structure

```
state/
  issues/
    <n>.json        # Maps issue number → its session file path
  sessions/
    <timestamp>_<id>.jsonl    # Full conversation log for a session
```

## How it works

- When an issue is first processed, a session file is created under `sessions/`.
- A mapping file under `issues/<n>.json` links each issue number to its latest session.
- On subsequent comments, the agent resumes the existing session via this mapping.
- All files here are committed by the agent after every interaction, making conversations fully auditable and resumable across workflow runs.
