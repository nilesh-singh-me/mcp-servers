import { z } from 'zod';
import { octokit } from '../github';

export const getCommitSchema = z.object({
  owner: z.string().describe('The repository owner'),
  repo: z.string().describe('The repository name'),
  ref: z.string().describe('The commit SHA or branch name to fetch'),
});

export async function getCommitHandler(input: z.infer<typeof getCommitSchema>) {
  try {
    const { owner, repo, ref } = input;
    
    const response = await octokit.rest.repos.getCommit({
      owner,
      repo,
      ref,
    });
    
    const commitData = {
      sha: response.data.sha,
      message: response.data.commit.message,
      author: response.data.commit.author?.name,
      date: response.data.commit.author?.date,
      html_url: response.data.html_url,
      stats: response.data.stats,
      files: response.data.files?.map((file: any) => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch,
      })),
    };
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(commitData, null, 2)
      }]
    };
  } catch (error: any) {
    return {
      isError: true,
      content: [{ type: "text", text: `GitHub API error: ${error.message}` }]
    };
  }
}
