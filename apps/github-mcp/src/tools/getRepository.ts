import { z } from 'zod';
import { octokit } from '../github';

export const getRepositorySchema = z.object({
  owner: z.string().describe('The repository owner'),
  repo: z.string().describe('The repository name'),
});

export async function getRepositoryHandler(input: z.infer<typeof getRepositorySchema>) {
  try {
    const { owner, repo } = input;
    
    const response = await octokit.rest.repos.get({
      owner,
      repo,
    });
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(response.data, null, 2)
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
