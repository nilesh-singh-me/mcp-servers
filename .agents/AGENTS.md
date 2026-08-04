# Agent Rules

## Rule: Adding New MCP Tools
When the user requests to add a new tool to the `github-mcp` server, you MUST ALWAYS perform the following steps during the planning phase before writing any TypeScript code:
1. Create a sequentially numbered markdown file in `apps/github-mcp/implementation-plan/` (e.g., `13-tool-<tool-name>.md`) detailing the tool's description, Input Schema, and Implementation Details.
2. Update `apps/github-mcp/implementation-plan/01-overview.md` to include the new tool in the directory tree structure under `src/tools/`.
3. Update `apps/github-mcp/implementation-plan/01-overview.md` to append the new tool's input and output format to the "Implement the following tools" section, incrementing the numbering.
