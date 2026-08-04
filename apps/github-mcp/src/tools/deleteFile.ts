import { z } from 'zod';
import { octokit } from '../github';

export const deleteFileSchema = z.object({
  owner: z.string().describe('The repository owner'),
  repo: z.string().describe('The repository name'),
  path: z.string().describe('The file path'),
  message: z.string().describe('The commit message'),
  sha: z.string().describe('The blob SHA of the file being deleted'),
  branch: z.string().describe('The branch name'),
});

export async function deleteFileHandler(input: z.infer<typeof deleteFileSchema>) {
  try {
    const { owner, repo, path, message, sha, branch } = input;
    
    const response = await octokit.rest.repos.deleteFile({
      owner,
      repo,
      path,
      message,
      sha,
      branch,
    });
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          commit: response.data.commit.sha,
          html_url: response.data.commit.html_url,
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
