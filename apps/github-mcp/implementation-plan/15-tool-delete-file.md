# deleteFile

**Description**: Delete a file directly via the GitHub API.
**Tool Name**: `deleteFile`
**File Path**: `src/tools/deleteFile.ts`

## Input Schema
- `owner` (string, required): The repository owner.
- `repo` (string, required): The repository name.
- `path` (string, required): The file path.
- `message` (string, required): The commit message.
- `sha` (string, required): The blob SHA of the file being deleted.
- `branch` (string, required): The branch name.

## Implementation Details
1. Define `deleteFileSchema` using `zod`.
2. Create `deleteFileHandler(input)` which calls `octokit.rest.repos.deleteFile(input)`.
3. Return the commit details.
