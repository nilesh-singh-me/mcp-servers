import { z } from 'zod';
import { octokit } from '../github';

export const mergePullRequestSchema = z.object({
  owner: z.string().describe('The repository owner'),
  repo: z.string().describe('The repository name'),
  pull_number: z.number().describe('The pull request number'),
  commit_title: z.string().optional().describe('Title for the automatic commit message'),
  commit_message: z.string().optional().describe('Extra detail to append to automatic commit message'),
  merge_method: z.enum(['merge', 'squash', 'rebase']).optional().describe('Merge method to use'),
});

export async function mergePullRequestHandler(input: z.infer<typeof mergePullRequestSchema>) {
  try {
    const { owner, repo, pull_number, commit_title, commit_message, merge_method } = input;
    
    const response = await octokit.rest.pulls.merge({
      owner,
      repo,
      pull_number,
      commit_title,
      commit_message,
      merge_method,
    });
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          merged: response.data.merged,
          message: response.data.message,
          sha: response.data.sha,
        }, null, 2)
      }]
    };
  } catch (error: any) {
    if (error.status === 405) {
      return {
        isError: true,
        content: [{ type: "text", text: `Pull Request #${input.pull_number} cannot be merged. It may not be mergeable or has already been merged.` }]
      };
    }
    return {
      isError: true,
      content: [{ type: "text", text: `GitHub API error: ${error.message}` }]
    };
  }
}
