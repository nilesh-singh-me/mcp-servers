# Tool 3: listPullRequests

## Goal
Implement a tool to list pull requests for a repository. This introduces the concept of *optional* inputs and *enums* (restricting input to a specific list of choices).

## Key Concepts to Understand Before Coding
- **Enums & Optional Values:** Pull requests can be "open", "closed", or "all". The AI shouldn't send us "pending" or some other random word. We can use Zod to restrict the allowed values (an enum). We can also make this parameter optional and give it a default value.

## Steps for Implementation

1. **Define What the Tool Needs (The Input Schema)**
   - Create `src/tools/listPullRequests.ts`.
   - The Zod schema needs:
     - `owner`: string
     - `repo`: string
     - `state`: Use `z.enum(['open', 'closed', 'all']).optional().default('open')`. This is very powerful! It tells the AI the exact valid options, and if the AI doesn't provide one, it defaults to 'open'.

2. **Write the Tool Logic (The Handler)**
   - Create a function that accepts `owner`, `repo`, and `state`.
   - Call GitHub API using `octokit.rest.pulls.list({ owner, repo, state })`.
   - Map the results to return just the essentials: `title`, `number` (the PR number), `user.login` (who opened it), and `state`.

3. **Handle Things Going Wrong (Error Handling)**
   - Similar to the repository tool, catch 404 errors if the repository doesn't exist.

4. **Wire It Up in the Server (`src/index.ts`)**
   - In `src/index.ts`, add `listPullRequests` to the tools array in `ListToolsRequestSchema`.
   - Add another `else if` in `CallToolRequestSchema` to route the request, validate the schema, run the logic, and return the result to the AI.
