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
import { getPullRequestSchema, getPullRequestHandler } from './tools/getPullRequest';
import { createPullRequestSchema, createPullRequestHandler } from './tools/createPullRequest';
import { listPullRequestFilesSchema, listPullRequestFilesHandler } from './tools/listPullRequestFiles';
import { createPullRequestReviewSchema, createPullRequestReviewHandler } from './tools/createPullRequestReview';
import { mergePullRequestSchema, mergePullRequestHandler } from './tools/mergePullRequest';
import { searchCodeSchema, searchCodeHandler } from './tools/searchCode';
import { createOrUpdateFileSchema, createOrUpdateFileHandler } from './tools/createOrUpdateFile';
import { deleteFileSchema, deleteFileHandler } from './tools/deleteFile';
import { listBranchesSchema, listBranchesHandler } from './tools/listBranches';
import { createBranchSchema, createBranchHandler } from './tools/createBranch';
import { listCommitsSchema, listCommitsHandler } from './tools/listCommits';
import { getCommitSchema, getCommitHandler } from './tools/getCommit';

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
      },
      {
        name: 'getPullRequest',
        description: 'Get details of a specific pull request.',
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string", description: "The repository owner" },
            repo: { type: "string", description: "The repository name" },
            pull_number: { type: "number", description: "The pull request number" }
          },
          required: ["owner", "repo", "pull_number"]
        }
      },
      {
        name: 'createPullRequest',
        description: 'Create a new pull request.',
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string", description: "The repository owner" },
            repo: { type: "string", description: "The repository name" },
            title: { type: "string", description: "The title of the pull request" },
            head: { type: "string", description: "The name of the branch where your changes are implemented" },
            base: { type: "string", description: "The name of the branch you want the changes pulled into" },
            body: { type: "string", description: "The contents of the pull request" },
            draft: { type: "boolean", description: "Indicates whether the pull request is a draft" },
            maintainer_can_modify: { type: "boolean", description: "Indicates whether maintainers can modify the pull request" }
          },
          required: ["owner", "repo", "title", "head", "base"]
        }
      },
      {
        name: 'listPullRequestFiles',
        description: 'List the files modified in a pull request.',
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string", description: "The repository owner" },
            repo: { type: "string", description: "The repository name" },
            pull_number: { type: "number", description: "The pull request number" }
          },
          required: ["owner", "repo", "pull_number"]
        }
      },
      {
        name: 'createPullRequestReview',
        description: 'Create a review for a pull request.',
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string", description: "The repository owner" },
            repo: { type: "string", description: "The repository name" },
            pull_number: { type: "number", description: "The pull request number" },
            body: { type: "string", description: "The body text of the pull request review" },
            event: { type: "string", enum: ["APPROVE", "REQUEST_CHANGES", "COMMENT"], description: "The review action to perform" },
            comments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  path: { type: "string", description: "The relative path to the file that necessitates a comment" },
                  body: { type: "string", description: "Text of the review comment" },
                  line: { type: "number", description: "The line of the blob in the pull request diff that the comment applies to" }
                },
                required: ["path", "body"]
              },
              description: "Comments to post along with the review"
            }
          },
          required: ["owner", "repo", "pull_number"]
        }
      },
      {
        name: 'mergePullRequest',
        description: 'Merge a pull request.',
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string", description: "The repository owner" },
            repo: { type: "string", description: "The repository name" },
            pull_number: { type: "number", description: "The pull request number" },
            commit_title: { type: "string", description: "Title for the automatic commit message" },
            commit_message: { type: "string", description: "Extra detail to append to automatic commit message" },
            merge_method: { type: "string", enum: ["merge", "squash", "rebase"], description: "Merge method to use" }
          },
          required: ["owner", "repo", "pull_number"]
        }
      },
      {
        name: 'searchCode',
        description: 'Search for specific functions or variables across the entire repository.',
        inputSchema: {
          type: "object",
          properties: {
            q: { type: "string", description: "The search query. You can include repo:owner/name to restrict the search." }
          },
          required: ["q"]
        }
      },
      {
        name: 'createOrUpdateFile',
        description: 'Commit small fixes or create new files directly via the GitHub API.',
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string", description: "The repository owner" },
            repo: { type: "string", description: "The repository name" },
            path: { type: "string", description: "The file path" },
            message: { type: "string", description: "The commit message" },
            content: { type: "string", description: "The new file content" },
            sha: { type: "string", description: "The blob SHA of the file being replaced (required if updating an existing file)" },
            branch: { type: "string", description: "The branch name" }
          },
          required: ["owner", "repo", "path", "message", "content", "branch"]
        }
      },
      {
        name: 'deleteFile',
        description: 'Delete a file directly via the GitHub API.',
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string", description: "The repository owner" },
            repo: { type: "string", description: "The repository name" },
            path: { type: "string", description: "The file path" },
            message: { type: "string", description: "The commit message" },
            sha: { type: "string", description: "The blob SHA of the file being deleted" },
            branch: { type: "string", description: "The branch name" }
          },
          required: ["owner", "repo", "path", "message", "sha", "branch"]
        }
      },
      {
        name: 'listBranches',
        description: 'See all available branches in a repository.',
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string", description: "The repository owner" },
            repo: { type: "string", description: "The repository name" },
            per_page: { type: "number", description: "Results per page" },
            page: { type: "number", description: "Page number of the results" }
          },
          required: ["owner", "repo"]
        }
      },
      {
        name: 'createBranch',
        description: 'Create a new branch to isolate work before making a PR.',
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string", description: "The repository owner" },
            repo: { type: "string", description: "The repository name" },
            branch: { type: "string", description: "The name of the new branch" },
            sha: { type: "string", description: "The SHA of the commit to branch off from" }
          },
          required: ["owner", "repo", "branch", "sha"]
        }
      },
      {
        name: 'listCommits',
        description: 'Fetch the commit history of a branch to understand recent changes.',
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string", description: "The repository owner" },
            repo: { type: "string", description: "The repository name" },
            sha: { type: "string", description: "SHA or branch to start listing commits from. Default: the repository\'s default branch" },
            per_page: { type: "number", description: "Results per page" },
            page: { type: "number", description: "Page number of the results" }
          },
          required: ["owner", "repo"]
        }
      },
      {
        name: 'getCommit',
        description: 'Fetch the details of a specific commit, including file changes and diffs.',
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string", description: "The repository owner" },
            repo: { type: "string", description: "The repository name" },
            ref: { type: "string", description: "The commit SHA or branch name to fetch" }
          },
          required: ["owner", "repo", "ref"]
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
    case 'getPullRequest': {
      const parsed = getPullRequestSchema.safeParse(request.params.arguments);
      if (!parsed.success) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid params: ${parsed.error.message}`);
      }
      return await getPullRequestHandler(parsed.data);
    }
    case 'createPullRequest': {
      const parsed = createPullRequestSchema.safeParse(request.params.arguments);
      if (!parsed.success) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid params: ${parsed.error.message}`);
      }
      return await createPullRequestHandler(parsed.data);
    }
    case 'listPullRequestFiles': {
      const parsed = listPullRequestFilesSchema.safeParse(request.params.arguments);
      if (!parsed.success) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid params: ${parsed.error.message}`);
      }
      return await listPullRequestFilesHandler(parsed.data);
    }
    case 'createPullRequestReview': {
      const parsed = createPullRequestReviewSchema.safeParse(request.params.arguments);
      if (!parsed.success) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid params: ${parsed.error.message}`);
      }
      return await createPullRequestReviewHandler(parsed.data);
    }
    case 'mergePullRequest': {
      const parsed = mergePullRequestSchema.safeParse(request.params.arguments);
      if (!parsed.success) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid params: ${parsed.error.message}`);
      }
      return await mergePullRequestHandler(parsed.data);
    }
    case 'searchCode': {
      const parsed = searchCodeSchema.safeParse(request.params.arguments);
      if (!parsed.success) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid params: ${parsed.error.message}`);
      }
      return await searchCodeHandler(parsed.data);
    }
    case 'createOrUpdateFile': {
      const parsed = createOrUpdateFileSchema.safeParse(request.params.arguments);
      if (!parsed.success) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid params: ${parsed.error.message}`);
      }
      return await createOrUpdateFileHandler(parsed.data);
    }
    case 'deleteFile': {
      const parsed = deleteFileSchema.safeParse(request.params.arguments);
      if (!parsed.success) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid params: ${parsed.error.message}`);
      }
      return await deleteFileHandler(parsed.data);
    }
    case 'listBranches': {
      const parsed = listBranchesSchema.safeParse(request.params.arguments);
      if (!parsed.success) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid params: ${parsed.error.message}`);
      }
      return await listBranchesHandler(parsed.data);
    }
    case 'createBranch': {
      const parsed = createBranchSchema.safeParse(request.params.arguments);
      if (!parsed.success) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid params: ${parsed.error.message}`);
      }
      return await createBranchHandler(parsed.data);
    }
    case 'listCommits': {
      const parsed = listCommitsSchema.safeParse(request.params.arguments);
      if (!parsed.success) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid params: ${parsed.error.message}`);
      }
      return await listCommitsHandler(parsed.data);
    }
    case 'getCommit': {
      const parsed = getCommitSchema.safeParse(request.params.arguments);
      if (!parsed.success) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid params: ${parsed.error.message}`);
      }
      return await getCommitHandler(parsed.data);
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
