import { z } from 'zod';
import { octokit } from '../github';

export const createOrUpdateFileSchema = z.object({
  owner: z.string().describe('The repository owner'),
  repo: z.string().describe('The repository name'),
  path: z.string().describe('The file path'),
  message: z.string().describe('The commit message'),
  content: z.string().describe('The new file content'),
  sha: z.string().optional().describe('The blob SHA of the file being replaced (required if updating an existing file)'),
  branch: z.string().describe('The branch name'),
});

export async function createOrUpdateFileHandler(input: z.infer<typeof createOrUpdateFileSchema>) {
  try {
    const { owner, repo, path, message, content, sha, branch } = input;
    
    // Base64 encode the content
    const base64Content = Buffer.from(content).toString('base64');
    
    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: base64Content,
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
