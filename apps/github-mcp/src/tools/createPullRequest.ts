import { z } from 'zod';
import { octokit } from '../github';

export const createPullRequestSchema = z.object({
  owner: z.string().describe('The repository owner'),
  repo: z.string().describe('The repository name'),
  title: z.string().describe('The title of the pull request'),
  head: z.string().describe('The name of the branch where your changes are implemented'),
  base: z.string().describe('The name of the branch you want the changes pulled into'),
  body: z.string().optional().describe('The contents of the pull request'),
  draft: z.boolean().optional().describe('Indicates whether the pull request is a draft'),
  maintainer_can_modify: z.boolean().optional().describe('Indicates whether maintainers can modify the pull request'),
});

export async function createPullRequestHandler(input: z.infer<typeof createPullRequestSchema>) {
  try {
    const { owner, repo, title, head, base, body, draft, maintainer_can_modify } = input;
    
    const response = await octokit.rest.pulls.create({
      owner,
      repo,
      title,
      head,
      base,
      body,
      draft,
      maintainer_can_modify,
    });
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          title: response.data.title,
          number: response.data.number,
          html_url: response.data.html_url,
          state: response.data.state,
          draft: response.data.draft,
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
