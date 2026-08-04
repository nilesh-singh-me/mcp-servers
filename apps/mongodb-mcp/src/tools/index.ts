import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { MongoClient } from "mongodb";
import { readTools, handleReadToolCall } from "./read.js";
import { mutateTools, handleMutateToolCall } from "./mutate.js";

export function getAvailableTools(allowMutations: boolean): Tool[] {
  const tools = [...readTools];
  if (allowMutations) {
    tools.push(...mutateTools);
  }
  return tools;
}

export async function handleToolCall(
  name: string,
  args: any,
  client: MongoClient,
  allowMutations: boolean
) {
  if (readTools.some((t) => t.name === name)) {
    return handleReadToolCall(name, args, client);
  }

  if (allowMutations && mutateTools.some((t) => t.name === name)) {
    return handleMutateToolCall(name, args, client);
  }

  if (!allowMutations && mutateTools.some((t) => t.name === name)) {
    throw new Error(
      `Tool ${name} is a mutation tool, but mutations are disabled. Set MONGODB_ALLOW_MUTATIONS=true to enable.`
    );
  }

  throw new Error(`Unknown tool: ${name}`);
}
