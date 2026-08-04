# createPullRequest

**Description**: Allow the AI to open a PR automatically once it finishes a coding task on a branch.
**Tool Name**: `createPullRequest`
**File Path**: `src/tools/createPullRequest.ts`

## Input Schema
- `owner` (string, required): The repository owner.
- `repo` (string, required): The repository name.
- `title` (string, required): The pull request title.
- `head` (string, required): The name of the branch where your changes are implemented.
- `base` (string, required): The name of the branch you want the changes pulled into.
- `body` (string, optional): The contents of the pull request.
- `draft` (boolean, optional): Indicates whether the pull request is a draft.
- `maintainer_can_modify` (boolean, optional): Indicates whether maintainers can modify the pull request.

## Implementation Details
1. Define `createPullRequestSchema` using `zod`.
2. Create `createPullRequestHandler(input)` which calls `octokit.rest.pulls.create(input)`.
3. Return the created PR details (e.g., URL, number).
