# Tool 4: createIssue

## Goal
Implement a tool that performs a **mutation**—meaning it changes something on GitHub instead of just reading data. We will create a new issue on a repository.

## Key Concepts to Understand Before Coding
- **Mutations & Permissions:** Reading data (like getting repositories) is often public and safe. Creating an issue requires write access. Your `GITHUB_TOKEN` must belong to a user who is allowed to create issues in the target repository. If not, GitHub will reject the request.

## Steps for Implementation

1. **Define What the Tool Needs (The Input Schema)**
   - Create `src/tools/createIssue.ts`.
   - The AI needs to provide four things:
     - `owner`: string
     - `repo`: string
     - `title`: string (The title of the issue)
     - `body`: string (The main text of the issue. Use `.optional()` because issues don't strictly require a body).

2. **Write the Tool Logic (The Handler)**
   - Create a function accepting those parameters.
   - Call GitHub using `octokit.rest.issues.create({ owner, repo, title, body })`.
   - The response will contain details about the newly created issue. Return the `html_url` (so the user can click it) and the `number` (the issue number).

3. **Handle Things Going Wrong (Error Handling)**
   - This is where error handling gets interesting. If the token lacks permissions, GitHub throws a 403 (Forbidden) error. Catch this specific error and return a message like "Failed to create issue. Does your token have the right permissions?"

4. **Wire It Up in the Server (`src/index.ts`)**
   - In `src/index.ts`, add `createIssue` to the tools array in `ListToolsRequestSchema`.
   - Add the routing logic in `CallToolRequestSchema` to validate the input, call our new handler, and return the result.
