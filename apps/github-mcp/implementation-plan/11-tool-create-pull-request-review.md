# createPullRequestReview

**Description**: Enable the AI to leave code review comments on specific lines or approve/request changes.
**Tool Name**: `createPullRequestReview`
**File Path**: `src/tools/createPullRequestReview.ts`

## Input Schema
- `owner` (string, required): The repository owner.
- `repo` (string, required): The repository name.
- `pull_number` (number, required): The pull request number.
- `body` (string, optional): The body text of the pull request review.
- `event` (string, optional): The review action (`APPROVE`, `REQUEST_CHANGES`, `COMMENT`).
- `comments` (array of objects, optional): Line-level comments.
  - `path` (string, required): The relative path to the file that necessitates a comment.
  - `body` (string, required): Text of the review comment.
  - `line` (number, optional): The line of the blob in the pull request diff that the comment applies to. For a multi-line comment, the last line of the range that your comment applies to.

## Implementation Details
1. Define `createPullRequestReviewSchema` using `zod`.
2. Create `createPullRequestReviewHandler(input)` which calls `octokit.rest.pulls.createReview(input)`.
3. Return the review URL and status.
