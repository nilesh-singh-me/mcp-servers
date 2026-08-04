import { z } from 'zod';
import { octokit } from '../github';

export const listCommitsSchema = z.object({
  owner: z.string().describe('The repository owner'),
  repo: z.string().describe('The repository name'),
  sha: z.string().optional().describe('SHA or branch to start listing commits from. Default: the repository\'s default branch'),
  per_page: z.number().optional().default(30).describe('Results per page'),
  page: z.number().optional().default(1).describe('Page number of the results'),
});

export async function listCommitsHandler(input: z.infer<typeof listCommitsSchema>) {
  try {
    const { owner, repo, sha, per_page, page } = input;
    
    const response = await octokit.rest.repos.listCommits({
      owner,
      repo,
      sha,
      per_page,
      page,
    });
    
    const commits = response.data.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author?.name,
      date: commit.commit.author?.date,
      html_url: commit.html_url,
    }));
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(commits, null, 2)
      }]
    };
  } catch (error: any) {
    return {
      isError: true,
      content: [{ type: "text", text: `GitHub API error: ${error.message}` }]
    };
  }
}
