# MCP Servers Monorepo

This repository is a monorepo for Model Context Protocol (MCP) servers, using `pnpm` workspaces. It currently contains the **GitHub MCP Server**, which provides tools to interact with GitHub using an AI agent.

## Setup

1. **Install Dependencies**
   Run the following command at the root of the repository to install all required dependencies:
   ```bash
   pnpm install
   ```

2. **Configure Environment Variables**
   The GitHub MCP server requires a Personal Access Token (PAT) to interact with the GitHub API.
   
   Navigate to the GitHub app directory and create your `.env` file:
   ```bash
   cd apps/github-mcp
   cp .env.example .env
   ```
   Open the `.env` file and replace `your_personal_access_token_here` with your actual GitHub PAT. You can generate one from your [GitHub Developer Settings](https://github.com/settings/tokens). Make sure it has `repo` access.

## Running the Server

You can run the server directly (it will run on `stdio` and wait for JSON-RPC messages):
```bash
pnpm run dev
```
*(Note: Running this command directly won't give you interactive feedback, as it's designed to be consumed by an AI client.)*

## Debugging and Testing (MCP Inspector)

To test the MCP tools interactively, you can use the official MCP Inspector. We have set up a convenient script that runs the inspector without polluting the standard output with `pnpm` logs.

From the root of the repository, run:
```bash
pnpm run inspector
```

**How to use the Inspector:**
1. The command will output a local URL (e.g., `http://localhost:5173`).
2. Open that URL in your browser.
3. Click the **Connect** button in the top right corner.
4. You will see a list of tools (like `listRepositories`, `getRepository`, etc.).
5. Click on a tool, enter the arguments (e.g., `nilesh-singh-me` for the `owner` field), and click **Run Tool** to see the live data fetched from GitHub!

## Project Structure

- `apps/github-mcp/`: The GitHub MCP server implementation.
  - `src/tools/`: Contains individual files for each tool (schemas and handlers).
  - `src/index.ts`: The main entrypoint that registers the tools and starts the server.
  - `src/config.ts`: Configuration loader (handles `.env`).
  - `src/github.ts`: The Octokit GitHub client setup.
