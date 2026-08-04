import { z } from 'zod';
import { octokit } from '../github';

export const searchCodeSchema = z.object({
  q: z.string().describe('The search query. You can include repo:owner/name to restrict the search.'),
});

export async function searchCodeHandler(input: z.infer<typeof searchCodeSchema>) {
  try {
    const { q } = input;
    
    const response = await octokit.rest.search.code({
      q,
    });
    
    const items = response.data.items.map(item => ({
      name: item.name,
      path: item.path,
      repository: item.repository.full_name,
      html_url: item.html_url,
    }));
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(items, null, 2)
      }]
    };
  } catch (error: any) {
    return {
      isError: true,
      content: [{ type: "text", text: `GitHub API error: ${error.message}` }]
    };
  }
}
