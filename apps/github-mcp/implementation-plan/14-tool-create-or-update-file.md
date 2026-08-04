# createOrUpdateFile

**Description**: Commit small fixes or create new files directly via the GitHub API.
**Tool Name**: `createOrUpdateFile`
**File Path**: `src/tools/createOrUpdateFile.ts`

## Input Schema
- `owner` (string, required): The repository owner.
- `repo` (string, required): The repository name.
- `path` (string, required): The file path.
- `message` (string, required): The commit message.
- `content` (string, required): The new file content.
- `sha` (string, optional): The blob SHA of the file being replaced (required if updating an existing file).
- `branch` (string, required): The branch name.

## Implementation Details
1. Define `createOrUpdateFileSchema` using `zod`.
2. Create `createOrUpdateFileHandler(input)` which calls `octokit.rest.repos.createOrUpdateFileContents(input)`. Base64 encode the `content` before sending.
3. Return the commit details.
