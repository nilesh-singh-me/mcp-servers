# getCommit

**Description**: Fetch the details of a specific commit, including file changes and diffs.
**Tool Name**: `getCommit`
**File Path**: `src/tools/getCommit.ts`

## Input Schema
- `owner` (string, required): The repository owner.
- `repo` (string, required): The repository name.
- `ref` (string, required): The commit SHA or branch name to fetch.

## Implementation Details
1. Define `getCommitSchema` using `zod`.
2. Create `getCommitHandler(input)` which calls `octokit.rest.repos.getCommit({ owner, repo, ref: input.ref })`.
3. Return the commit details including the commit message, author, date, and the list of files modified (along with their `patch` if available).
