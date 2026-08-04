# mergePullRequest

**Description**: Automatically merge a PR when it's approved and CI passes.
**Tool Name**: `mergePullRequest`
**File Path**: `src/tools/mergePullRequest.ts`

## Input Schema
- `owner` (string, required): The repository owner.
- `repo` (string, required): The repository name.
- `pull_number` (number, required): The pull request number.
- `commit_title` (string, optional): Title for the automatic commit message.
- `commit_message` (string, optional): Extra detail to append to automatic commit message.
- `merge_method` (string, optional): Merge method to use (`merge`, `squash`, or `rebase`).

## Implementation Details
1. Define `mergePullRequestSchema` using `zod`.
2. Create `mergePullRequestHandler(input)` which calls `octokit.rest.pulls.merge(input)`.
3. Return whether the merge was successful or blocked, and the `merged` boolean.
