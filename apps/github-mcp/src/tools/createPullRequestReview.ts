import { z } from 'zod';
import { octokit } from '../github';

export const createPullRequestReviewSchema = z.object({
  owner: z.string().describe('The repository owner'),
  repo: z.string().describe('The repository name'),
  pull_number: z.number().describe('The pull request number'),
  body: z.string().optional().describe('The body text of the pull request review'),
  event: z.enum(['APPROVE', 'REQUEST_CHANGES', 'COMMENT']).optional().describe('The review action to perform'),
  comments: z.array(z.object({
    path: z.string().describe('The relative path to the file that necessitates a comment'),
    body: z.string().describe('Text of the review comment'),
    line: z.number().optional().describe('The line of the blob in the pull request diff that the comment applies to'),
  })).optional().describe('Comments to post along with the review'),
});

export async function createPullRequestReviewHandler(input: z.infer<typeof createPullRequestReviewSchema>) {
  try {
    const { owner, repo, pull_number, body, event, comments } = input;
    
    const response = await octokit.rest.pulls.createReview({
      owner,
      repo,
      pull_number,
      body,
      event,
      comments,
    });
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          id: response.data.id,
          state: response.data.state,
          html_url: response.data.html_url,
          body: response.data.body,
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
