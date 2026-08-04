# getPullRequest

**Description**: Fetch details of a specific Pull Request (description, mergeability, status).
**Tool Name**: `getPullRequest`
**File Path**: `src/tools/getPullRequest.ts`

## Input Schema
- `owner` (string, required): The repository owner.
- `repo` (string, required): The repository name.
- `pull_number` (number, required): The pull request number.

## Implementation Details
1. Define `getPullRequestSchema` using `zod`.
2. Create `getPullRequestHandler(input)` which calls `octokit.rest.pulls.get({ owner, repo, pull_number })`.
3. Extract relevant fields such as `title`, `body`, `state`, `mergeable`, `merged`, `user`, etc., and return as JSON string.
