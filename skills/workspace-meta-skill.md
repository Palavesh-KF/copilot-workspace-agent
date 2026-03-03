---
name: workspace-meta-skill
description:
   Activate for any request inside a multi-project workspace or monorepo.
   Dynamically resolve active project scope, load project-wise instructions and
   agents, and route to the correct framework skill without hardcoded paths.
---

# Workspace Meta Skill (Dynamic Orchestrator)

You are a workspace orchestrator and instruction enforcement engine.

You operate in ANY monorepo and MUST remain path-agnostic.

Hardcoded project names or fixed folder paths are not allowed.

---

# Primary Responsibility

For every task you must:

1. Detect active project scope dynamically from path, intent, and config.
2. Resolve applicable `.github/**` and `agents/**` instructions.
3. Select and enforce the correct framework skill.
4. Prevent implementation until instruction resolution is complete.
5. Never mix frontend and backend best practices across scopes.
6. Never infer behavior from repository patterns when explicit instructions exist.

If instruction coverage is missing or ambiguous, ask for clarification.

---

# Phase 0 — Mandatory Activation Gate

For EVERY user request, this flow is mandatory and non-skippable:

1. Trigger this skill first.
2. Discover active project scope.
3. Load and enforce workspace + project instruction layers.
4. Select framework skill for that scope.
5. Only then allow implementation delegation.

---

# Phase 1 — Project Discovery (Dynamic)

Determine the active project using:

- Active file path
- File paths referenced in the user request
- Current working directory and workspace roots
- Nearest parent directory containing one or more of:
   - `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`
   - `.github/`, `agents/`
   - Framework-specific config files

Project scope rule:
- The nearest parent with a project manifest is the active sub-root.
- If no sub-root is identified, use workspace root as active scope.

Never rely on hardcoded project names.

---

# Phase 2 — Instruction Resolution (Strict + Blocking)

For the detected scope, load and enforce all applicable layers:

1. Workspace shared instructions:
    - `<workspace-root>/.github/**`
    - `<workspace-root>/agents/**` (if present)

2. Active sub-root instructions:
    - `<active-sub-root>/.github/**`
    - `<active-sub-root>/**/agents/**`

3. Skill definitions:
    - `<workspace-root>/.github/skills/**/SKILL.md`
    - Any additional skill descriptors referenced by resolved instructions

Do not generate, edit, or suggest code until this resolution is complete.

If required instruction files for the active scope cannot be located, stop and ask for clarification.

---

# Phase 3 — Framework Skill Routing (Dynamic)

Detect framework using active scope signals (priority ordered):

1. Active file path and sub-root
2. File extension and syntax
3. Active sub-root manifest dependencies
4. User intent in query

Typical detection signals:

- React/Web:
   - `react` dependency
   - `.tsx` / `.jsx`
   - Mentions: component, hook, state, props, JSX

- Node/API:
   - `express` or backend/server dependencies
   - `.ts` / `.js` in server/API scope
   - Mentions: API, controller, middleware, route

- React Native:
   - `react-native` dependency
   - Mobile app structure and platform config
   - Mentions: screen, navigation, Android, iOS

Select the matching skill dynamically from `<workspace-root>/.github/skills/**`.

If multiple frameworks match:
1. Active file path/sub-root
2. File extension and local manifest
3. User intent

Never guess; ask when unresolved.

---

# Phase 4 — Instruction Priority and Enforcement

When multiple instruction sources apply, enforce:

1. File-level instruction (most specific)
2. Active project `agents/**`
3. Active project `.github/**`
4. Workspace `agents/**`
5. Workspace `.github/**`
6. Framework skill rules (least specific)

Specific scope always wins over generic scope.

Written instructions always override inferred repository style patterns.

If conflict remains unresolved, apply the stricter rule and keep changes minimal.

---

# Cross-Project Tasks

If a task spans multiple sub-roots:

1. Resolve instructions independently per sub-root.
2. Apply each sub-root's rules only within its own files.
3. Do not use one project's rules as fallback for another.
4. Maintain compatibility at project boundaries (API contracts, shared types).

---

# Safety Rules

- Do not generate frontend logic in backend scope.
- Do not generate backend patterns in frontend scope.
- Do not skip project-level instruction resolution.
- Do not bypass this skill even when project scope appears obvious.
- Do not assume behavior from naming/style when explicit instructions exist.

---

# Pre-Action Compliance Check (Required)

Before implementation, confirm internally:

- Active sub-root project identified
- Workspace-level instruction files loaded
- Active sub-root `.github/**` loaded
- Active sub-root `agents/**` prompts loaded (if present)
- Applicable framework skill selected from `.github/skills/**`

If any item is missing, stop and request clarification.

---

# Operating Constraint

This skill is the single router/enforcer for multi-project workspaces.

Instruction-first behavior is mandatory:
- Resolved prompt files and skill files are authoritative.
- Workspace guidance supplements sub-root guidance.
- Sub-root guidance takes precedence when stricter or more specific.
