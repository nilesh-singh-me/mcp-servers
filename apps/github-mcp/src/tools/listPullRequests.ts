import { z } from 'zod';
import { octokit } from '../github';

export const listPullRequestsSchema = z.object({
  owner: z.string().describe('The repository owner'),
  repo: z.string().describe('The repository name'),
  state: z.enum(['open', 'closed', 'all']).optional().default('open').describe('State of the PRs to list'),
});

export async function listPullRequestsHandler(input: z.infer<typeof listPullRequestsSchema>) {
  try {
    const { owner, repo, state } = input;
    
    const response = await octokit.rest.pulls.list({
      owner,
      repo,
      state,
    });
    
    const prs = response.data.map(pr => ({
      title: pr.title,
      number: pr.number,
      author: pr.user?.login,
      state: pr.state,
    }));
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(prs, null, 2)
      }]
    };
  } catch (error: any) {
    if (error.status === 404) {
      return {
        isError: true,
        content: [{ type: "text", text: `Repository '${input.owner}/${input.repo}' not found.` }]
      };
    }
    return {
      isError: true,
      content: [{ type: "text", text: `GitHub API error: ${error.message}` }]
    };
  }
}
