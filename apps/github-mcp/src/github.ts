import { Octokit } from 'octokit';
import { config } from './config';

// Create a configured Octokit instance to talk to the GitHub API
export const octokit = new Octokit({
  auth: config.githubToken,
});
