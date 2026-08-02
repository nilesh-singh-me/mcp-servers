# Tool 2: getRepository

## Goal
Implement a tool that fetches detailed information about a *single* specific repository. This shows how to require multiple pieces of input data from the AI.

## Key Concepts to Understand Before Coding
- **Multiple Inputs:** Unlike the previous tool which just needed a username, this one needs both the `owner` (e.g., "octocat") and the `repo` name (e.g., "Hello-World") to find the exact repository. Zod handles this easily.

## Steps for Implementation

1. **Define What the Tool Needs (The Input Schema)**
   - Create `src/tools/getRepository.ts`.
   - Use Zod to define an object: `z.object({ owner: z.string(), repo: z.string() })`. This strictly tells the AI "You must provide both!".

2. **Write the Tool Logic (The Handler)**
   - Write an `async` function that takes `owner` and `repo` as parameters.
   - Call the GitHub API using `octokit.rest.repos.get({ owner, repo })`.
   - Again, don't return everything. Return useful details like the name, description, default branch, language, and URL.

3. **Handle Things Going Wrong (Error Handling)**
   - What if the AI asks for a repository that doesn't exist?
   - In the `try...catch` block, if GitHub throws an error with a `status` of `404`, catch it and return a friendly error message like "Repository 'octocat/nonexistent' not found." This is much better than the server crashing.

4. **Wire It Up in the Server (`src/index.ts`)**
   - Go to `src/index.ts`.
   - Add this new tool to the `ListToolsRequestSchema` array so the AI knows it exists.
   - In the `CallToolRequestSchema` section, add an `else if (request.params.name === 'getRepository')` check.
   - Validate the input using our new Zod schema, call the handler, and return the result.
