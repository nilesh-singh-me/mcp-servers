# listPullRequestFiles

**Description**: See which files were modified in a PR (essential for an AI to perform code reviews).
**Tool Name**: `listPullRequestFiles`
**File Path**: `src/tools/listPullRequestFiles.ts`

## Input Schema
- `owner` (string, required): The repository owner.
- `repo` (string, required): The repository name.
- `pull_number` (number, required): The pull request number.

## Implementation Details
1. Define `listPullRequestFilesSchema` using `zod`.
2. Create `listPullRequestFilesHandler(input)` which calls `octokit.rest.pulls.listFiles(input)`.
3. Map over the files and return `filename`, `status`, `additions`, `deletions`, `changes`, and the `patch` string.
