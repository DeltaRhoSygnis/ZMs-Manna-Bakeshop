# OpenCode-ready development container for GitHub Codespaces.
#
# Build context is the repository root (set in devcontainer.json), so the
# laptop OpenCode configuration under ./opencode is copied into the image.
#
# The container deliberately does NOT include ~/.local/share/opencode
# (opencode.db, WAL, logs, snapshots) or ~/.config/opencode/service.json.
# Those are machine state and secrets; the server generates a fresh password
# for each container instead.

FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

ARG OPENCODE_VERSION=2.0.22

USER root

# Small helpers available on PATH inside the container.
COPY .devcontainer/bin/ /usr/local/bin/
RUN chmod 0755 /usr/local/bin/oc-pair /usr/local/bin/oc-password

USER node
ENV PATH="/home/node/.opencode/bin:${PATH}"

# OpenCode 2 ships as a self-contained binary, so no Node runtime is needed
# for the CLI itself (Node is still here for npx-based MCP servers).
RUN curl -fsSL https://opencode.ai/v2/install \
      | bash -s -- --version "${OPENCODE_VERSION}" --no-modify-path \
 && opencode --version

# Copy the configuration surface only: agents, commands, skills, plugins,
# ECC assets, opencode.json and cli.json.
COPY --chown=node:node opencode/config/ /home/node/.config/opencode/
COPY --chown=node:node opencode/home/ /home/node/.opencode/

RUN chmod 600 /home/node/.config/opencode/opencode.json \
              /home/node/.config/opencode/cli.json \
 && mkdir -p /home/node/.cache/opencode \
             /home/node/.local/state/opencode \
             /home/node/.local/share/opencode

USER node
WORKDIR /workspaces

EXPOSE 4096
