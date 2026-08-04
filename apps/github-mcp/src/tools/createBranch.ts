import { z } from 'zod';
import { octokit } from '../github';

export const createBranchSchema = z.object({
  owner: z.string().describe('The repository owner'),
  repo: z.string().describe('The repository name'),
  branch: z.string().describe('The name of the new branch'),
  sha: z.string().describe('The SHA of the commit to branch off from'),
});

export async function createBranchHandler(input: z.infer<typeof createBranchSchema>) {
  try {
    const { owner, repo, branch, sha } = input;
    
    const response = await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branch}`,
      sha,
    });
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          ref: response.data.ref,
          url: response.data.url,
          object: {
            type: response.data.object.type,
            sha: response.data.object.sha,
            url: response.data.object.url,
          }
        }, null, 2)
      }]
    };
  } catch (error: any) {
    return {
      isError: true,
      content: [{ type: "text", text: `GitHub API error: ${error.message}` }]
    };
  }
}
