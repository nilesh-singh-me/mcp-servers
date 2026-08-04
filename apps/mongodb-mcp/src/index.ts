import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { MongoClient } from "mongodb";
import { getAvailableTools, handleToolCall } from "./tools/index.js";
// Load environment variables (passed directly by the MCP client)

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is required");
  process.exit(1);
}

const ALLOW_MUTATIONS = process.env.MONGODB_ALLOW_MUTATIONS === "true";

class MongoDbServer {
  private server: Server;
  private client: MongoClient;
  private isConnected = false;

  constructor() {
    this.server = new Server(
      {
        name: "mongodb-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.client = new MongoClient(MONGODB_URI!);

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.cleanup();
      process.exit(0);
    });
  }

  private async connect() {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
      console.error("Connected to MongoDB");
    }
  }

  private async cleanup() {
    if (this.isConnected) {
      await this.client.close();
      this.isConnected = false;
      console.error("Disconnected from MongoDB");
    }
    await this.server.close();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: getAvailableTools(ALLOW_MUTATIONS),
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      await this.connect();
      
      try {
        return await handleToolCall(
          request.params.name,
          request.params.arguments,
          this.client,
          ALLOW_MUTATIONS
        );
      } catch (error: any) {
        if (error.name === "ZodError") {
          throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid arguments: ${error.message}`
          );
        }
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error(`MongoDB MCP server running on stdio`);
    console.error(`Mutations allowed: ${ALLOW_MUTATIONS}`);
  }
}

const server = new MongoDbServer();
server.run().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
