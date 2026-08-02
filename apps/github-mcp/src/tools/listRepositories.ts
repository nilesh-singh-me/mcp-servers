import { z } from 'zod';
import { octokit } from '../github';

// Define the input schema using Zod
export const listRepositoriesSchema = z.object({
  owner: z.string().describe('The GitHub owner (user or organization)'),
});

// The handler function
export async function listRepositoriesHandler(input: z.infer<typeof listRepositoriesSchema>) {
  try {
    const { owner } = input;
    
    // Call the GitHub API
    const response = await octokit.rest.repos.listForUser({
      username: owner,
      per_page: 50,
    });
    
    // Map the results to just what we need
    const repositories = response.data.map(repo => ({
      name: repo.name,
      description: repo.description,
      visibility: repo.visibility,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
    }));
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(repositories, null, 2)
      }]
    };
  } catch (error: any) {
    if (error.status === 404) {
      return {
        isError: true,
        content: [{ type: "text", text: `User or organization '${input.owner}' not found.` }]
      };
    }
    return {
      isError: true,
      content: [{ type: "text", text: `GitHub API error: ${error.message}` }]
    };
  }
}
