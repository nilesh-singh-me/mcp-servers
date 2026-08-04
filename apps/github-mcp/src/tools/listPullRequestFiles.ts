import { z } from 'zod';
import { octokit } from '../github';

export const listPullRequestFilesSchema = z.object({
  owner: z.string().describe('The repository owner'),
  repo: z.string().describe('The repository name'),
  pull_number: z.number().describe('The pull request number'),
});

export async function listPullRequestFilesHandler(input: z.infer<typeof listPullRequestFilesSchema>) {
  try {
    const { owner, repo, pull_number } = input;
    
    const response = await octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number,
    });
    
    const files = response.data.map(file => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
      patch: file.patch,
    }));
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(files, null, 2)
      }]
    };
  } catch (error: any) {
    if (error.status === 404) {
      return {
        isError: true,
        content: [{ type: "text", text: `Pull Request #${input.pull_number} not found in ${input.owner}/${input.repo}.` }]
      };
    }
    return {
      isError: true,
      content: [{ type: "text", text: `GitHub API error: ${error.message}` }]
    };
  }
}
