# Tool 1: listRepositories

## Goal
Implement our first tool. When the AI asks "What repositories does the user 'octocat' have?", this tool will answer. We will learn how to define what the tool needs (schema), how to register it, and how to write the logic.

## Key Concepts to Understand Before Coding
- **Schemas:** We must tell the AI exactly what information a tool needs. For this tool, it only needs a GitHub username (`owner`). We use `Zod` to define this rule.
- **Registering Tools (`ListToolsRequestSchema`):** The server needs a way to say, "Hey AI, here is a list of tools I know how to use."
- **Handling Tools (`CallToolRequestSchema`):** When the AI decides to use a tool, it sends a request. We have to catch that request, run our code, and send the result back.

## Steps for Implementation

1. **Define What the Tool Needs (The Input Schema)**
   - Create a folder `src/tools/` and a file `listRepositories.ts`.
   - Use `z.object({ owner: z.string() })` to say: "This tool requires an object with an 'owner' property, and it must be text (string)."

2. **Write the Tool Logic (The Handler)**
   - In the same file, write an `async` function. It takes the `owner` as an argument.
   - Use our pre-configured `octokit` (from `src/github.ts`) to call GitHub: `octokit.rest.repos.listForUser({ username: owner })`.
   - **Important:** GitHub returns a *lot* of data. The AI doesn't need all of it, and sending too much data wastes processing power. Map over the response and only return: `name`, `description`, `visibility`, `stargazers_count` (stars), and `forks_count`.

3. **Handle Things Going Wrong (Error Handling)**
   - Wrap the GitHub API call in a `try...catch` block.
   - If GitHub says the user wasn't found (a 404 error), we shouldn't crash the server. Instead, return a polite message to the AI saying "User not found."

4. **Wire It Up in the Server (`src/index.ts`)**
   - Go back to `src/index.ts`.
   - Tell the server to handle tool listing:
     ```typescript
     server.setRequestHandler(ListToolsRequestSchema, async () => {
       return {
         tools: [
           {
             name: 'listRepositories',
             description: 'Lists repositories for a given GitHub user',
             inputSchema: zodToJsonSchema(ListRepositoriesSchema), // Convert Zod to JSON so the AI understands it
           }
         ]
       };
     });
     ```
   - Tell the server what to do when the tool is called:
     ```typescript
     server.setRequestHandler(CallToolRequestSchema, async (request) => {
       if (request.params.name === 'listRepositories') {
         // 1. Validate the input using Zod
         // 2. Call our handler function in listRepositories.ts
         // 3. Return the data as a JSON string
       }
     });
     ```

5. **Testing**
   - You can't easily test this by just running it in the terminal because it expects JSON-RPC protocol messages.
   - We will test it properly in step 8, but for now, ensure TypeScript compiles without errors.
