import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

// Import our tool schemas and handlers
import { listRepositoriesSchema, listRepositoriesHandler } from './tools/listRepositories';
import { getRepositorySchema, getRepositoryHandler } from './tools/getRepository';
import { listPullRequestsSchema, listPullRequestsHandler } from './tools/listPullRequests';
import { createIssueSchema, createIssueHandler } from './tools/createIssue';
import { getFileSchema, getFileHandler } from './tools/getFile';

import { zodToJsonSchema } from 'zod-to-json-schema';

// 1. Create a new MCP Server instance
const server = new Server(
  {
    name: 'github-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 2. Define the tools available to the AI (ListToolsRequestSchema)
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'listRepositories',
        description: 'List repositories for a GitHub user or organization.',
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string", description: "The GitHub owner (user or organization)" }
          },
          required: ["owner"]
        },
      },
      {
        name: 'getRepository',
        description: 'Get details of a specific GitHub repository.',
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string", description: "The GitHub repository owner" },
            repo: { type: "string", description: "The GitHub repository name" }
          },
          required: ["owner", "repo"]
        },
      },
      {
        name: 'listPullRequests',
        description: 'List pull requests for a specific GitHub repository.',
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string", description: "The GitHub repository owner" },
            repo: { type: "string", description: "The GitHub repository name" }
          },
          required: ["owner", "repo"]
        },
      },
      {
        name: 'createIssue',
        description: 'Create a new issue in a GitHub repository.',
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string", description: "The GitHub repository owner" },
            repo: { type: "string", description: "The GitHub repository name" },
            title: { type: "string", description: "The issue title" },
            body: { type: "string", description: "The issue body content" }
          },
          required: ["owner", "repo", "title"]
        },
      },
      {
        name: 'getFile',
        description: 'Get the contents of a specific file in a GitHub repository.',
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string", description: "The GitHub repository owner" },
            repo: { type: "string", description: "The GitHub repository name" },
            path: { type: "string", description: "The file path in the repository" },
            ref: { type: "string", description: "The branch or commit ref (optional)" }
          },
          required: ["owner", "repo", "path"]
        }
      }
    ],
  };
});


// 3. Handle Tool Execution (CallToolRequestSchema)
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case 'listRepositories': {
      const parsed = listRepositoriesSchema.safeParse(request.params.arguments);
      if (!parsed.success) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid params: ${parsed.error.message}`);
      }
      return await listRepositoriesHandler(parsed.data);
    }
    case 'getRepository': {
      const parsed = getRepositorySchema.safeParse(request.params.arguments);
      if (!parsed.success) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid params: ${parsed.error.message}`);
      }
      return await getRepositoryHandler(parsed.data);
    }
    case 'listPullRequests': {
      const parsed = listPullRequestsSchema.safeParse(request.params.arguments);
      if (!parsed.success) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid params: ${parsed.error.message}`);
      }
      return await listPullRequestsHandler(parsed.data);
    }
    case 'createIssue': {
      const parsed = createIssueSchema.safeParse(request.params.arguments);
      if (!parsed.success) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid params: ${parsed.error.message}`);
      }
      return await createIssueHandler(parsed.data);
    }
    case 'getFile': {
      const parsed = getFileSchema.safeParse(request.params.arguments);
      if (!parsed.success) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid params: ${parsed.error.message}`);
      }
      return await getFileHandler(parsed.data);
    }
    default:
      throw new McpError(
        ErrorCode.MethodNotFound,
        `Unknown tool: ${request.params.name}`
      );
  }
});

// 4. Start the server
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('GitHub MCP server is running on stdio');
}

run().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
