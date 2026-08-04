# listBranches

**Description**: See all available branches in a repository.
**Tool Name**: `listBranches`
**File Path**: `src/tools/listBranches.ts`

## Input Schema
- `owner` (string, required): The repository owner.
- `repo` (string, required): The repository name.
- `per_page` (number, optional): Results per page (default 30).
- `page` (number, optional): Page number of the results (default 1).

## Implementation Details
1. Define `listBranchesSchema` using `zod`.
2. Create `listBranchesHandler(input)` which calls `octokit.rest.repos.listBranches(input)`.
3. Return a list of branch names and their commit SHAs.
