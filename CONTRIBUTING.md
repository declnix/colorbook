# Contributing

## Commit convention

Format: `type(scope): message`

### Types

| Type | When |
|------|------|
| `feat` | new aspect, program, host, or user |
| `fix` | bug fix in configuration |
| `refactor` | restructuring without behavior change |
| `docs` | documentation, README, CLAUDE.md, CONTRIBUTING.md |
| `chore` | `flake.lock` updates, housekeeping, renames |

### Scopes

- **Programs/aspects:** `niri`, `git`, `wsl`, `zsh`, `tmux`, `nvf`, `fonts`, `hjem`, `nix`, `podman`
- **Hosts:** `z4c1sz3`, `bur34u`, `c4rg0x`
- **Global:** `flake`, `den`, `hardware`

Omit scope only for truly global commits (e.g. `init`).

## Directory naming

Directories that should sort first when listing are prefixed with `@` (e.g. `@z4c1sz3`, `@configurations`, `@users`). Use this prefix for important structural directories, not for every folder.

### Rules

- Scope = name of the **host** when the change is host-specific, otherwise name of the aspect or file being changed
- Message lowercase, no trailing period

### Examples

```
feat(hjem): add hjem-impure with impure.enable by default
fix(waybar): correct battery module format
refactor(hjem): move hjem input to hjem-setup.nix
chore(flake): update lock file
```
