import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { MongoClient } from "mongodb";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const listDatabasesSchema = z.object({});

const listCollectionsSchema = z.object({
  database: z.string().describe("The name of the database"),
});

const findSchema = z.object({
  database: z.string().describe("The name of the database"),
  collection: z.string().describe("The name of the collection"),
  filter: z.record(z.string(), z.any()).optional().describe("MongoDB query filter"),
  projection: z.record(z.string(), z.any()).optional().describe("Fields to include or exclude"),
  sort: z.record(z.string(), z.any()).optional().describe("Sort order"),
  limit: z.number().optional().describe("Maximum number of documents to return"),
  skip: z.number().optional().describe("Number of documents to skip"),
});

const aggregateSchema = z.object({
  database: z.string().describe("The name of the database"),
  collection: z.string().describe("The name of the collection"),
  pipeline: z.array(z.record(z.string(), z.any())).describe("Aggregation pipeline stages"),
});

export const readTools: Tool[] = [
  {
    name: "list_databases",
    description: "List all available MongoDB databases",
    inputSchema: zodToJsonSchema(listDatabasesSchema as any) as any,
  },
  {
    name: "list_collections",
    description: "List all collections in a specific MongoDB database",
    inputSchema: zodToJsonSchema(listCollectionsSchema as any) as any,
  },
  {
    name: "find",
    description: "Find documents in a MongoDB collection",
    inputSchema: zodToJsonSchema(findSchema as any) as any,
  },
  {
    name: "aggregate",
    description: "Run an aggregation pipeline on a MongoDB collection",
    inputSchema: zodToJsonSchema(aggregateSchema as any) as any,
  },
];

export async function handleReadToolCall(
  name: string,
  args: any,
  client: MongoClient
) {
  switch (name) {
    case "list_databases": {
      const adminDb = client.db().admin();
      const result = await adminDb.listDatabases();
      return {
        content: [{ type: "text", text: JSON.stringify(result.databases, null, 2) }],
      };
    }

    case "list_collections": {
      const parsed = listCollectionsSchema.parse(args);
      const db = client.db(parsed.database);
      const collections = await db.listCollections().toArray();
      return {
        content: [{ type: "text", text: JSON.stringify(collections, null, 2) }],
      };
    }

    case "find": {
      const parsed = findSchema.parse(args);
      const db = client.db(parsed.database);
      const collection = db.collection(parsed.collection);

      let cursor = collection.find(parsed.filter || {});
      
      if (parsed.projection) cursor = cursor.project(parsed.projection);
      if (parsed.sort) cursor = cursor.sort(parsed.sort as any);
      if (parsed.skip) cursor = cursor.skip(parsed.skip);
      if (parsed.limit) cursor = cursor.limit(parsed.limit);

      const documents = await cursor.toArray();
      return {
        content: [{ type: "text", text: JSON.stringify(documents, null, 2) }],
      };
    }

    case "aggregate": {
      const parsed = aggregateSchema.parse(args);
      const db = client.db(parsed.database);
      const collection = db.collection(parsed.collection);

      const cursor = collection.aggregate(parsed.pipeline);
      const documents = await cursor.toArray();
      return {
        content: [{ type: "text", text: JSON.stringify(documents, null, 2) }],
      };
    }

    default:
      throw new Error(`Unknown read tool: ${name}`);
  }
}
