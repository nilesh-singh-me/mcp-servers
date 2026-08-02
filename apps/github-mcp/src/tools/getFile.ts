import { z } from 'zod';
import { octokit } from '../github';

export const getFileSchema = z.object({
  owner: z.string().describe('The repository owner'),
  repo: z.string().describe('The repository name'),
  path: z.string().describe('The path to the file (e.g., README.md)'),
});

export async function getFileHandler(input: z.infer<typeof getFileSchema>) {
  try {
    const { owner, repo, path } = input;
    
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });
    
    const data = response.data as any; // Cast because getContent can return a single file or an array of files
    
    if (data.type !== 'file') {
      return {
        isError: true,
        content: [{ type: "text", text: `The requested path '${path}' is a directory or not a file.` }]
      };
    }
    
    if (!data.content) {
       return {
        isError: true,
        content: [{ type: "text", text: `No content found for file '${path}'.` }]
      };
    }
    
    const decodedContent = Buffer.from(data.content, 'base64').toString('utf8');
    
    return {
      content: [{
        type: "text",
        text: decodedContent
      }]
    };
  } catch (error: any) {
    if (error.status === 404) {
      return {
        isError: true,
        content: [{ type: "text", text: `File '${input.path}' or repository '${input.owner}/${input.repo}' not found.` }]
      };
    }
    return {
      isError: true,
      content: [{ type: "text", text: `GitHub API error: ${error.message}` }]
    };
  }
}
