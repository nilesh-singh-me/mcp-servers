# Tool 5: getFile

## Goal
Implement a tool to fetch the actual text content of a file from a GitHub repository (like a README or a source code file).

## Key Concepts to Understand Before Coding
- **Base64 Encoding:** When you ask the GitHub API for file contents, it doesn't send you raw text. It sends it encoded in a format called "Base64" to ensure it travels safely over the internet. We have to decode it back into normal text (UTF-8) before giving it to the AI.

## Steps for Implementation

1. **Define What the Tool Needs (The Input Schema)**
   - Create `src/tools/getFile.ts`.
   - The AI must provide: `owner`, `repo`, and the `path` to the file (e.g., `README.md` or `src/index.js`). Use Zod to make all three required strings.

2. **Write the Tool Logic (The Handler)**
   - Create the function.
   - Use `octokit.rest.repos.getContent({ owner, repo, path })`.
   - **The tricky part:** The GitHub API might return data for a directory instead of a file if the path points to a folder. We need to check if the response data has a `type` property equal to `'file'`.
   - If it is a file, the content is in `response.data.content`.
   - **Decode it:** Use Node.js's built-in Buffer class to decode it: `Buffer.from(response.data.content, 'base64').toString('utf8')`.
   - Return this decoded string to the AI.

3. **Handle Things Going Wrong (Error Handling)**
   - Catch 404 errors (file or repo doesn't exist).
   - If the user asks for a directory instead of a file, return an error message saying "The requested path is a directory, not a file."

4. **Wire It Up in the Server (`src/index.ts`)**
   - Add `getFile` to `src/index.ts` in both the `ListToolsRequestSchema` and the `CallToolRequestSchema` handler exactly as we've done for the previous four tools.
