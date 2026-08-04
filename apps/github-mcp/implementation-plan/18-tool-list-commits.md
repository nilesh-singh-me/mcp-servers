# listCommits

**Description**: Fetch the commit history of a branch to understand recent changes.
**Tool Name**: `listCommits`
**File Path**: `src/tools/listCommits.ts`

## Input Schema
- `owner` (string, required): The repository owner.
- `repo` (string, required): The repository name.
- `sha` (string, optional): SHA or branch to start listing commits from. Default: the repository's default branch.
- `per_page` (number, optional): Results per page (default 30).
- `page` (number, optional): Page number of the results (default 1).

## Implementation Details
1. Define `listCommitsSchema` using `zod`.
2. Create `listCommitsHandler(input)` which calls `octokit.rest.repos.listCommits(input)`.
3. Return a list of commits with their SHA, author, and commit message.
