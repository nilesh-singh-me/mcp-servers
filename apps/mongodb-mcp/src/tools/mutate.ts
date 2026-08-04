import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { MongoClient } from "mongodb";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const insertOneSchema = z.object({
  database: z.string().describe("The name of the database"),
  collection: z.string().describe("The name of the collection"),
  document: z.record(z.string(), z.any()).describe("The document to insert"),
});

const insertManySchema = z.object({
  database: z.string().describe("The name of the database"),
  collection: z.string().describe("The name of the collection"),
  documents: z.array(z.record(z.string(), z.any())).describe("The documents to insert"),
});

const updateOneSchema = z.object({
  database: z.string().describe("The name of the database"),
  collection: z.string().describe("The name of the collection"),
  filter: z.record(z.string(), z.any()).describe("The filter to select the document"),
  update: z.record(z.string(), z.any()).describe("The update operations to apply"),
  upsert: z.boolean().optional().describe("Whether to insert if no document matches"),
});

const updateManySchema = z.object({
  database: z.string().describe("The name of the database"),
  collection: z.string().describe("The name of the collection"),
  filter: z.record(z.string(), z.any()).describe("The filter to select documents"),
  update: z.record(z.string(), z.any()).describe("The update operations to apply"),
});

const deleteOneSchema = z.object({
  database: z.string().describe("The name of the database"),
  collection: z.string().describe("The name of the collection"),
  filter: z.record(z.string(), z.any()).describe("The filter to select the document to delete"),
});

const deleteManySchema = z.object({
  database: z.string().describe("The name of the database"),
  collection: z.string().describe("The name of the collection"),
  filter: z.record(z.string(), z.any()).describe("The filter to select documents to delete"),
});

export const mutateTools: Tool[] = [
  {
    name: "insert_one",
    description: "Insert a single document into a MongoDB collection",
    inputSchema: zodToJsonSchema(insertOneSchema as any) as any,
  },
  {
    name: "insert_many",
    description: "Insert multiple documents into a MongoDB collection",
    inputSchema: zodToJsonSchema(insertManySchema as any) as any,
  },
  {
    name: "update_one",
    description: "Update a single document in a MongoDB collection",
    inputSchema: zodToJsonSchema(updateOneSchema as any) as any,
  },
  {
    name: "update_many",
    description: "Update multiple documents in a MongoDB collection",
    inputSchema: zodToJsonSchema(updateManySchema as any) as any,
  },
  {
    name: "delete_one",
    description: "Delete a single document from a MongoDB collection",
    inputSchema: zodToJsonSchema(deleteOneSchema as any) as any,
  },
  {
    name: "delete_many",
    description: "Delete multiple documents from a MongoDB collection",
    inputSchema: zodToJsonSchema(deleteManySchema as any) as any,
  },
];

export async function handleMutateToolCall(
  name: string,
  args: any,
  client: MongoClient
) {
  switch (name) {
    case "insert_one": {
      const parsed = insertOneSchema.parse(args);
      const db = client.db(parsed.database);
      const collection = db.collection(parsed.collection);
      const result = await collection.insertOne(parsed.document);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "insert_many": {
      const parsed = insertManySchema.parse(args);
      const db = client.db(parsed.database);
      const collection = db.collection(parsed.collection);
      const result = await collection.insertMany(parsed.documents);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "update_one": {
      const parsed = updateOneSchema.parse(args);
      const db = client.db(parsed.database);
      const collection = db.collection(parsed.collection);
      const result = await collection.updateOne(parsed.filter, parsed.update, {
        upsert: parsed.upsert,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "update_many": {
      const parsed = updateManySchema.parse(args);
      const db = client.db(parsed.database);
      const collection = db.collection(parsed.collection);
      const result = await collection.updateMany(parsed.filter, parsed.update);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "delete_one": {
      const parsed = deleteOneSchema.parse(args);
      const db = client.db(parsed.database);
      const collection = db.collection(parsed.collection);
      const result = await collection.deleteOne(parsed.filter);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "delete_many": {
      const parsed = deleteManySchema.parse(args);
      const db = client.db(parsed.database);
      const collection = db.collection(parsed.collection);
      const result = await collection.deleteMany(parsed.filter);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    default:
      throw new Error(`Unknown mutate tool: ${name}`);
  }
}
