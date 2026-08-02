import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const listRepositoriesSchema = z.object({
  owner: z.string().describe("The GitHub owner (user or organization)"),
});

console.log("Without name:", JSON.stringify(zodToJsonSchema(listRepositoriesSchema), null, 2));
console.log("With name:", JSON.stringify(zodToJsonSchema(listRepositoriesSchema, "mySchema"), null, 2));
