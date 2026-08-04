import { z } from 'zod';
import { octokit } from '../github';

export const listBranchesSchema = z.object({
  owner: z.string().describe('The repository owner'),
  repo: z.string().describe('The repository name'),
  per_page: z.number().optional().default(30).describe('Results per page'),
  page: z.number().optional().default(1).describe('Page number of the results'),
});

export async function listBranchesHandler(input: z.infer<typeof listBranchesSchema>) {
  try {
    const { owner, repo, per_page, page } = input;
    
    const response = await octokit.rest.repos.listBranches({
      owner,
      repo,
      per_page,
      page,
    });
    
    const branches = response.data.map(branch => ({
      name: branch.name,
      commit_sha: branch.commit.sha,
      protected: branch.protected,
    }));
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(branches, null, 2)
      }]
    };
  } catch (error: any) {
    return {
      isError: true,
      content: [{ type: "text", text: `GitHub API error: ${error.message}` }]
    };
  }
}
