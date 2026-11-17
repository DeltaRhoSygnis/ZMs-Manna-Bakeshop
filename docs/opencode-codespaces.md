# OpenCode in GitHub Codespaces

This repository ships a development container that installs **OpenCode 2** and
loads the operator's global OpenCode configuration: agents, commands, skills,
plugins, ECC assets, `opencode.json` and `cli.json`.

The container is built from [`.devcontainer/Dockerfile`](../.devcontainer/Dockerfile)
with the repository root as its build context. The configuration source of
truth is the [`opencode/`](../opencode) directory.

## What is inside

| Path in the container | Source in the repo | Contents |
| --- | --- | --- |
| `~/.config/opencode/` | `opencode/config/` | `opencode.json`, `cli.json`, `agents/`, `commands/`, `skills/`, `plugins/`, `ecc/` |
| `~/.opencode/skills/` | `opencode/home/skills/` | The skills referenced as `~/.opencode/skills` in `opencode.json` |
| `/usr/local/bin/oc-pair` | `.devcontainer/bin/oc-pair` | Prints a fresh one-time pairing link |
| `/usr/local/bin/oc-password` | `.devcontainer/bin/oc-password` | Prints the container's server password |

## What is deliberately excluded

- `~/.local/share/opencode/` — the session database (`opencode.db`, WAL/SHM),
  logs, snapshots and tool output. The container starts with an empty database.
- `~/.config/opencode/service.json` — the laptop's shared-service password.
  The setup script deletes it and the server generates a new password per
  container.
- Local credentials and provider auth. Sign in again inside the Codespace if a
  model or integration needs it.

`opencode.json` is path-independent: the absolute laptop skills path was
rewritten to `/home/node/.config/opencode/ecc/skills`.

## Use it

1. Push the repository, then create a Codespace from it (Code → Codespaces →
   Create codespace on `master`). Codespaces detects `.devcontainer/` and builds
   the image.
2. On start, `postStartCommand` launches `opencode serve` on `0.0.0.0:4096`.
   Port 4096 is forwarded privately to your browser.
3. The terminal prints:
   - the password login (`username: opencode`, `password: …`), and
   - a one-time pairing link.
4. Open the pairing link, or open port 4096 from the **Ports** tab and log in
   with the printed password.

Pairing links are single use and expire after five minutes. Run `oc-pair` (or
`bash .devcontainer/pair-opencode.sh`) at any time to print a new one. The
`postAttachCommand` also prints a new link each time a VS Code client connects.

The password is generated once per container and stored in
`~/.config/opencode/.server-password` (mode 600). `oc-password` prints it.

## Manage the server

```sh
curl -u "opencode:$(oc-password)" http://127.0.0.1:4096/api/info
tail -f ~/.local/share/opencode/serve.log
bash .devcontainer/start-opencode.sh   # restart
pkill -f '[o]pencode serve'            # stop
```

## Update the shipped configuration

The image copies `opencode/config` and `opencode/home` at build time, and
`postCreateCommand` re-syncs them from the workspace on container create.
To refresh an exported copy from a machine:

```sh
rsync -a --exclude service.json --exclude .server-password \
  ~/.config/opencode/ opencode/config/
rsync -a ~/.opencode/skills/ opencode/home/skills/
```

Then commit and rebuild the container (`Codespaces: Rebuild Container`) so the
image and the workspace copy match. Never commit `service.json`, the database,
or provider credentials.

## Build and run locally

Docker is required.

```sh
docker build -f .devcontainer/Dockerfile -t zm-manna-opencode .
docker run --rm -p 4096:4096 -v "$PWD:/workspaces/zm-manna" zm-manna-opencode
```

The image does not include the site's assets beyond what the workspace mount
provides; it only adds the toolchain and OpenCode configuration.
