# MCP Servers Monorepo

Welcome to the `mcp-servers` monorepo. This repository is organized to house multiple Model Context Protocol (MCP) servers alongside shared packages, providing a scalable and unified environment for development.

## Project Structure

We use a monorepo setup managed by `pnpm`. The workspace is divided into `apps` (individual MCP servers) and `packages` (shared libraries).

```text
mcp-servers/
├── package.json
├── pnpm-workspace.yaml
├── apps/
│   ├── github-mcp/       # GitHub integration MCP server
│   ├── slack-mcp/        # Slack integration MCP server
│   ├── notion-mcp/       # Notion integration MCP server
│   ├── postgres-mcp/     # PostgreSQL integration MCP server
│   └── filesystem-mcp/   # Local filesystem MCP server
│
└── packages/
    ├── shared/           # Shared types and common utilities
    ├── logger/           # Standardized logging configuration
    ├── config/           # Shared configuration files (e.g., tsconfig, linting)
    ├── github-client/    # Encapsulated GitHub API client logic
    └── mcp-utils/        # Utilities specifically for building MCP servers
```

## How It Works

- **Apps (`apps/`)**: These are the standalone server implementations. Each application in this folder represents a distinct MCP server that exposes different tools and resources. 
  - *Current Focus*: The `github-mcp` is the currently active implementation. You can find its specific implementation plan and documentation inside `apps/github-mcp/implementation-plan`.

- **Packages (`packages/`)**: These contain shared code that can be imported across various apps. Extracting logic into `packages/` ensures consistency and avoids code duplication across multiple MCP servers.

## Getting Started

1. Ensure you have `pnpm` installed.
2. Run `pnpm install` at the root to install all dependencies across the workspace.
3. Dive into the specific app folder (e.g., `apps/github-mcp`) to start working on a server.
