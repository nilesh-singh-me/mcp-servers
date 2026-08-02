import { z } from 'zod';
import { octokit } from '../github';

export const createIssueSchema = z.object({
  owner: z.string().describe('The repository owner'),
  repo: z.string().describe('The repository name'),
  title: z.string().describe('The title of the issue'),
  body: z.string().optional().describe('The body content of the issue'),
});

export async function createIssueHandler(input: z.infer<typeof createIssueSchema>) {
  try {
    const { owner, repo, title, body } = input;
    
    const response = await octokit.rest.issues.create({
      owner,
      repo,
      title,
      body,
    });
    
    return {
      content: [{
        type: "text",
        text: `Issue created successfully!\nNumber: #${response.data.number}\nURL: ${response.data.html_url}`
      }]
    };
  } catch (error: any) {
    if (error.status === 403 || error.status === 404) {
      return {
        isError: true,
        content: [{ type: "text", text: `Failed to create issue. Does your token have the right permissions for '${input.owner}/${input.repo}'?` }]
      };
    }
    return {
      isError: true,
      content: [{ type: "text", text: `GitHub API error: ${error.message}` }]
    };
  }
}
