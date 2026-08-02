Here's a prompt that's specifically designed for **learning MCP**, rather than building a massive production server. It guides the AI to explain concepts while building a small but complete GitHub MCP server.

```
You are an expert in the Model Context Protocol (MCP), Node.js, and TypeScript.

Your goal is to teach me MCP by building a small GitHub MCP server from scratch.

I do NOT want a production-scale project with dozens of tools. Instead, I want to understand how MCP works internally by implementing a few useful tools.

## About Me

- I am a MERN stack developer.
- I know JavaScript/TypeScript, Node.js, Express, REST APIs, and Git.
- I have never built an MCP server before.
- Explain MCP concepts as we build the project.

----------------------------------------------------
Project Requirements
----------------------------------------------------

Tech Stack

- Node.js 22+
- TypeScript
- Official MCP SDK
- Octokit
- dotenv
- Zod
- npm

Project Structure

```

github-mcp/
│
├── src/
│   ├── index.ts
│   ├── github.ts
│   ├── config.ts
│   ├── tools/
│   │     listRepositories.ts
│   │     getRepository.ts
│   │     listPullRequests.ts
│   │     createIssue.ts
│   │     getFile.ts
│   └── types.ts
│
├── .env.example
├── package.json
├── tsconfig.json
└── README.md

```

----------------------------------------------------
Learning Goals
----------------------------------------------------

While writing the code, explain:

- What is MCP?
- What is an MCP Server?
- What is an MCP Client?
- How do they communicate?
- What is a Tool?
- What is a Resource?
- What is a Prompt?
- When should each be used?
- How does the MCP SDK expose tools?
- How does the AI discover available tools?
- How does tool execution happen?
- How are tool parameters validated?
- How are responses returned?

Explain every concept before writing code.

----------------------------------------------------
Implement only these tools
----------------------------------------------------

1. listRepositories

Input

{
  "owner": "octocat"
}

Returns

- repository name
- description
- visibility
- stars
- forks

----------------------------------------------------

2. getRepository

Input

{
  "owner": "octocat",
  "repo": "Hello-World"
}

Returns repository details.

----------------------------------------------------

3. listPullRequests

Input

{
  "owner": "...",
  "repo": "...",
  "state": "open"
}

Returns PR title, number, author and status.

----------------------------------------------------

4. createIssue

Input

{
  "owner": "...",
  "repo": "...",
  "title": "...",
  "body": "..."
}

Creates an issue.

----------------------------------------------------

5. getFile

Input

{
  "owner": "...",
  "repo": "...",
  "path": "README.md"
}

Returns decoded file contents.

----------------------------------------------------
Validation
----------------------------------------------------

Use Zod.

Show how schemas are connected to MCP tools.

----------------------------------------------------
Authentication
----------------------------------------------------

Use GitHub Personal Access Token.

Read from

GITHUB_TOKEN=

using dotenv.

Explain why authentication is needed.

----------------------------------------------------
Error Handling
----------------------------------------------------

Handle

- invalid repo
- invalid owner
- authentication failure
- rate limit
- missing file

Return meaningful MCP errors.

----------------------------------------------------
Teaching Style
----------------------------------------------------

Do NOT generate the entire project at once.

Build the project incrementally.

For every step:

1. Explain the concept.
2. Explain why we're doing it.
3. Write the code.
4. Explain every important line.
5. Show how to test it.
6. Wait before moving to the next step.

----------------------------------------------------
Testing
----------------------------------------------------

After every completed tool, show:

- Example request
- Expected response
- How an MCP client invokes it
- What happens internally inside the MCP server

----------------------------------------------------
Final Goal
----------------------------------------------------

By the end, I should understand:

- How MCP works internally
- How tools are registered
- How tools are invoked
- How GitHub API calls are made
- How MCP returns results
- How to add new tools on my own
- How to connect this server to ChatGPT, Claude Desktop, VS Code, or Cursor

Assume I want to become confident enough to build my own MCP servers after completing this tutorial.
```

This prompt encourages the AI to act like a tutor, building the server step by step instead of dumping a large codebase, which is generally the fastest way to understand MCP.
