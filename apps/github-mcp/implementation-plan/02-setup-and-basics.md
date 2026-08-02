# Setup and Basics Implementation Plan

## Goal
Set up the foundational project structure. The goal is to make sure a beginner understands *why* we are installing certain packages and *how* the basic Model Context Protocol (MCP) server starts up.

## Key Concepts to Understand Before Coding
- **MCP (Model Context Protocol):** A standard way for AI assistants to talk to external tools (like GitHub). Our "server" will expose these tools.
- **Transports (stdio):** MCP clients (like Claude) talk to our server using standard input and standard output (the terminal). It's just sending JSON back and forth over the command line!
- **Octokit:** The official GitHub tool (SDK) for Node.js. It makes talking to GitHub's API much easier than writing raw `fetch` requests.
- **Zod:** A library we use to ensure the AI sends us the correct data type (e.g., making sure `owner` is a string and not a number).

## Steps for Implementation

1. **Initialize Project**
   - Create a folder: `github-mcp`
   - Run `npm init -y` to create a `package.json` file.
   - Install the main packages we need:
     - `@modelcontextprotocol/sdk`: The official toolkit for building MCP servers.
     - `octokit`: To talk to GitHub.
     - `dotenv`: To safely load our GitHub token from a `.env` file instead of hardcoding it.
     - `zod`: To validate inputs from the AI.
   - Install developer tools:
     - `typescript`, `@types/node`, `tsx` (tsx lets us run TypeScript files directly without compiling them first).
   - Set up TypeScript by running `npx tsc --init` to create a `tsconfig.json`.

2. **Folder Structure & Configuration**
   - Create a folder called `src/` where all our code will live.
   - Create a `.env` file for your secret `GITHUB_TOKEN`. (Never commit this to Git!)
   - Create `src/config.ts`: This file will load `dotenv` and make the `GITHUB_TOKEN` easily available to the rest of our app. If the token is missing, it should crash early and warn the user.

3. **Connecting to GitHub (Octokit)**
   - Create `src/github.ts`.
   - Inside, import `Octokit` and create a new instance using the token from `config.ts`.
   - Export this `octokit` instance so our tools can use it to fetch data.

4. **The Core MCP Server (The Brain)**
   - Create `src/index.ts`. This is the entry point.
   - Import the `Server` class from the MCP SDK.
   - Create a new `Server` object. Give it a name (like `"github-mcp"`) and a version (`"1.0.0"`).
   - We need to tell the server how to listen for messages. Set up a `StdioServerTransport` (this tells it to listen to terminal inputs/outputs).
   - Call `server.connect(transport)` to start it up.

5. **Start Script**
   - In `package.json`, add a script: `"start": "tsx src/index.ts"`.
   - Now, running `npm start` will start the server. (It won't do much yet because we haven't added tools, but it shouldn't crash!)
