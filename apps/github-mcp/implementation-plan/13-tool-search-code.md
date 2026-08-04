# searchCode

**Description**: Search for specific functions or variables across the entire repository.
**Tool Name**: `searchCode`
**File Path**: `src/tools/searchCode.ts`

## Input Schema
- `q` (string, required): The search query. You can include `repo:owner/name` in the query to restrict to a repository.

## Implementation Details
1. Define `searchCodeSchema` using `zod`.
2. Create `searchCodeHandler(input)` which calls `octokit.rest.search.code(input)`.
3. Return a list of matched files and code snippets.
