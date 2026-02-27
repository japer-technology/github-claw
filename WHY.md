# WHY — Installation vs Fork Parent

### The fundamental design theory difference of .GITCLAW installed into any repo vs its fork parent

---

## The One-Sentence Answer

Installing `.GITCLAW` into any repository is **composition** — the agent serves the host. Forking the parent repository is **inheritance** — the agent *is* the host. This distinction produces fundamentally different relationships between agent, codebase, and identity.

---

## 1. Composition vs Inheritance

The most fundamental difference maps directly to a core principle in software design.

**Installation into any repo = Composition (has-a)**

> *"My repository HAS a .GITCLAW agent."*

The `.GITCLAW/` folder is a component dropped into a larger context. The host repository has its own purpose — a web application, a library, a documentation site — and `.GITCLAW` enhances it. The agent is subordinate to the project. The relationship is additive: the project existed before the agent arrived, and it would continue to exist if the agent were removed.

**Forking the parent = Inheritance (is-a)**

> *"My repository IS a .GITCLAW project."*

The fork creates a copy of the entire `.GITCLAW` development repository. The agent lives inside a repo whose primary purpose is to define the agent itself. The relationship is constitutive: the project exists *because of* the agent. Remove `.GITCLAW` and there is no project.

This is the root distinction from which all other differences follow.

---

## 2. Tool vs Subject

When `.GITCLAW` is installed into any repo, it is a **tool**. The repository's README describes the project's purpose. The issues discuss the project's bugs and features. The agent assists with *that* work — reviewing code, triaging issues, generating documentation for the host project.

When `.GITCLAW` lives in its fork parent, it is the **subject**. The repository's README describes `.GITCLAW` itself. The issues discuss `.GITCLAW`'s bugs and features. The agent, if activated, would be assisting with work *on itself* — a fundamentally self-referential relationship.

| Dimension | Any Repo (Installation) | Fork Parent |
|---|---|---|
| Agent's role | Tool serving the project | Subject of the project |
| Issues are about | The host project | The agent framework itself |
| Code changes are to | The host project's codebase | The agent's own codebase |
| Agent's context | External domain (web app, library, etc.) | Self (its own design, docs, tests) |

In any repo, the agent looks *outward* at someone else's code. In the fork parent, the agent looks *inward* at its own.

---

## 3. Identity and Purpose

`.GITCLAW` is designed so that each installation develops its own identity — a name, a personality, a set of skills tuned to the host repo's domain. The "Hatch" ritual (guided personality setup via issue template) produces an agent whose identity is shaped by and for its host.

In a web framework repository, the agent might become a documentation expert. In a security library, it might specialize in vulnerability analysis. The agent's identity is *derived from* its environment.

In the fork parent, the agent's environment is `.GITCLAW` itself. Its identity would be self-referential: an agent whose expertise is being an agent. This is not inherently wrong, but it is a categorically different design relationship — the agent becomes a mirror instead of a lens.

---

## 4. The "Repository is the Application" Paradox

`.GITCLAW`'s core thesis is: *"The repository is the application."* The repo provides compute (Actions), storage (git), interface (Issues), and identity (permissions). The agent doesn't live outside and reach in — it lives *inside*.

When installed into any repo, this thesis is clean: the web app repo becomes the application platform, and `.GITCLAW` is the agent running on that platform. There are two distinct things — the platform (host repo) and the agent (`.GITCLAW` folder) — and their roles are clear.

When living in the fork parent, the thesis becomes recursive: the `.GITCLAW` repo is both the platform *and* the thing running on the platform. The agent's source code, its documentation, its design decisions, and its runtime state all occupy the same space. The platform is the agent. The agent is the platform.

```
Any repo:       [Host Project] ←contains← [.GITCLAW agent]
                 (platform)                 (component)

Fork parent:    [.GITCLAW repo] ←contains← [.GITCLAW agent]
                 (platform = agent)          (self-reference)
```

---

## 5. State and History

**In any repo:** The agent starts with a clean slate. The `state/` directory is empty. Sessions begin fresh. Conversations are about the host project's domain. The agent's memory accumulates organically from interactions specific to that codebase. There is no inherited baggage.

**In the fork parent:** The fork inherits the upstream's full git history — every design decision, every documentation revision, every session log from development. The `state/` directory may contain sessions from the original developers. The agent's "memory" includes context it didn't earn through its own interactions.

This distinction matters because `.GITCLAW`'s memory model is *git-native*. When you fork a repo, you fork the agent's mind. In a fresh installation, the mind starts empty and grows from experience. In a fork, the mind starts pre-loaded with someone else's experience.

---

## 6. Separation of Concerns

**In any repo:** There is a clean boundary between the tool and the project. The `.GITCLAW/` folder is self-contained. The host repo's `src/`, `tests/`, `docs/` directories are the project. Changes to the agent framework are changes to `.GITCLAW/`. Changes to the project are changes to everything else. Two people can work independently — one on the project, one on the agent configuration — without collision.

**In the fork parent:** There is no separation. The `.GITCLAW/` folder contains the agent *and* is the project. Changing the agent's lifecycle scripts is both a framework change and a project change. The installer, the documentation, the tests, the design docs — they are simultaneously the agent's infrastructure and the repository's content.

This is why the project's own documentation recommends **copying** the `.GITCLAW/` folder rather than forking: to preserve this separation. The [Delivery Methods](/.GITCLAW/docs/GITCLAW-Delivery-Methods.md) document explicitly notes that template repositories produce "a clean commit history (no fork baggage)" — recognizing that the fork parent's history is development scaffolding, not operational context.

---

## 7. Update Mechanics

The two approaches create fundamentally different update paths:

**Installation (any repo):** Updates are explicit — copy the newer `.GITCLAW/` folder, run the installer, review the diff, commit. The update is a discrete event visible in git history. Future delivery methods (GitHub App, CLI tool, Marketplace Action) will automate this, but the pattern remains: the update is an *import* of external changes into the host repo.

**Fork parent:** Updates flow naturally via `git pull upstream` or `git merge upstream/main`. This is elegant from a git perspective but conflates two categories of change: improvements to the agent framework and changes to the host project. Every upstream merge brings `.GITCLAW` development history into your repo's timeline.

The installation model treats `.GITCLAW` as a **dependency** — versioned, replaceable, with a clear boundary. The fork model treats it as a **lineage** — inherited, entangled, with shared history.

---

## 8. The Laboratory vs The Deployment

The fork parent is where `.GITCLAW` **evolves**. It is the laboratory — the place where lifecycle scripts are debugged, documentation is written, design decisions are made, and the installer is tested. The 285 commits ahead of upstream represent iterative development: experimentation, refactoring, exploration.

Any repo is where `.GITCLAW` **operates**. It is the deployment — the place where the agent does real work for a real project. The `.GITCLAW/` folder arrives as a finished artifact, ready to serve.

This maps to a well-understood pattern in software:

| Role | Fork Parent | Any Repo |
|---|---|---|
| Analogy | Factory | Customer site |
| `.GITCLAW` is | Being built | Being used |
| Changes to `.GITCLAW` are | Development | Configuration |
| The primary activity is | Evolving the agent framework | Conversing with the agent |
| The git history tells | How the agent was made | How the agent was used |

---

## 9. Why This Distinction Matters

The entire design of `.GITCLAW` is optimized for the **installation** model. Every architectural decision reinforces it:

- **Self-contained folder** — `.GITCLAW/` has no dependencies on files outside itself, so it can be dropped into any repo without modification.
- **Installer script** — `GITCLAW-INSTALLER.ts` copies workflows and templates into `.github/`, bridging the gap between the agent folder and the host repo's GitHub integration.
- **Fail-closed sentinel** — `GITCLAW-ENABLED.md` ensures the agent does nothing until explicitly activated in the host repo, preventing accidental triggering in repos that merely contain the folder.
- **Personality hatching** — The onboarding ritual assumes the agent is meeting a *new* project for the first time and needs to discover its identity in context.
- **Git-native state** — Sessions and mappings start empty, designed to accumulate from the host repo's interactions.

The fork parent, by contrast, is a *development environment* for `.GITCLAW` itself. It is not designed to be an operational deployment. It contains test suites for the framework, design documents about the framework, and development history of the framework — none of which are relevant to the agent's operational role in a host repo.

---

## 10. The Design Theory in One Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FORK PARENT                              │
│                                                             │
│  The .GITCLAW repo IS the project.                          │
│  The agent IS the subject.                                  │
│  Identity is self-referential.                              │
│  History is development history.                            │
│  State is inherited.                                        │
│  No separation between tool and project.                    │
│                                                             │
│  Relationship: INHERITANCE (is-a)                           │
│  The repo IS a .GITCLAW project.                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

                          vs

┌─────────────────────────────────────────────────────────────┐
│                    ANY REPO                                 │
│                                                             │
│  The host repo HAS a .GITCLAW agent.                        │
│  The agent is a tool serving the project.                   │
│  Identity is derived from the host.                         │
│  History is operational history.                            │
│  State starts clean.                                        │
│  Clean separation between tool and project.                 │
│                                                             │
│  Relationship: COMPOSITION (has-a)                          │
│  The repo HAS a .GITCLAW agent.                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Conclusion

The fundamental design theory difference is **composition vs inheritance** — and `.GITCLAW` is designed for composition.

When installed into any repository, `.GITCLAW` fulfills its intended role: a self-contained agent that adapts to its host, starts with a clean identity, and maintains a clear boundary between itself and the project it serves. The agent looks outward. The tool serves the subject.

When living in its fork parent, `.GITCLAW` becomes self-referential: an agent inside a repository about agents, with inherited state, entangled history, and no separation between the tool and its subject. The agent looks inward. The tool *is* the subject.

Both configurations are technically functional — the workflows trigger, the agent responds, the sessions persist. But they embody different design theories: one treats `.GITCLAW` as a **portable component** composed into a larger system; the other treats it as a **lineage** inherited from a development ancestor.

The project's architecture, documentation, delivery methods, and onboarding rituals all point to the same conclusion: `.GITCLAW` is designed to be installed, not inherited. The folder is the agent. The delivery method is just the door. And the door is meant to open into someone else's house.

🦞
