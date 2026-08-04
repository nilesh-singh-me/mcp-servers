import { z } from 'zod';
import { octokit } from '../github';

export const getPullRequestSchema = z.object({
  owner: z.string().describe('The repository owner'),
  repo: z.string().describe('The repository name'),
  pull_number: z.number().describe('The pull request number'),
});

export async function getPullRequestHandler(input: z.infer<typeof getPullRequestSchema>) {
  try {
    const { owner, repo, pull_number } = input;
    
    const response = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number,
    });
    
    const pr = {
      title: response.data.title,
      number: response.data.number,
      state: response.data.state,
      author: response.data.user?.login,
      body: response.data.body,
      mergeable: response.data.mergeable,
      merged: response.data.merged,
      draft: response.data.draft,
      html_url: response.data.html_url,
    };
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(pr, null, 2)
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
