# createBranch

**Description**: Create a new branch (e.g., fix/typo-in-readme) to isolate work before making a PR.
**Tool Name**: `createBranch`
**File Path**: `src/tools/createBranch.ts`

## Input Schema
- `owner` (string, required): The repository owner.
- `repo` (string, required): The repository name.
- `branch` (string, required): The name of the new branch.
- `sha` (string, required): The SHA of the commit to branch off from.

## Implementation Details
1. Define `createBranchSchema` using `zod`.
2. Create `createBranchHandler(input)` which calls `octokit.rest.git.createRef({ owner, repo, ref: "refs/heads/" + branch, sha })`.
3. Return the new branch reference details.
