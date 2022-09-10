import * as core from '@actions/core';
import {context} from '@actions/github';
import Octokit from './integrations/Octokit';
import {datesToDue} from './utils/dateUtils';
import {OVERDUE_TAG_NAME, DUE_THREEDAYS_TAG_NAME, NEXT_WEEK_TAG_NAME, DUE_TOMORROW_TAG_NAME} from './constants';

export const run = async () => {
  try {
    const githubToken = core.getInput('GH_TOKEN');
    if (!githubToken) {
      throw new Error('Missing GH_TOKEN environment variable');
    }

    const ok = new Octokit(githubToken);

    const issues = await ok.listAllOpenIssues(context.repo.owner, context.repo.repo);
    const results = await ok.getIssuesWithDueDate(issues);
    for (const issue of results) {
      const daysUtilDueDate = await datesToDue(issue.due);

      // 7 days until due date
      if (daysUtilDueDate <= 7 && daysUtilDueDate > 0) {
        await ok.addLabelToIssue(context.repo.owner, context.repo.repo, issue.number, [NEXT_WEEK_TAG_NAME]);
      }
      // 3 days due
      if (daysUtilDueDate <= 3 && daysUtilDueDate > 0) {
        await ok.removeLabelFromIssue(context.repo.owner, context.repo.repo, NEXT_WEEK_TAG_NAME, issue.number);
        await ok.addLabelToIssue(context.repo.owner, context.repo.repo, issue.number, [DUE_THREEDAYS_TAG_NAME]);
      }
      // 1 day due
      if (daysUtilDueDate <= 1 && daysUtilDueDate > 0) {
        await ok.removeLabelFromIssue(context.repo.owner, context.repo.repo, DUE_THREEDAYS_TAG_NAME, issue.number);
        await ok.addLabelToIssue(context.repo.owner, context.repo.repo, issue.number, [DUE_TOMORROW_TAG_NAME]);
      }
      // Issue is due
      if (daysUtilDueDate <= 0) {
        await ok.removeLabelFromIssue(context.repo.owner, context.repo.repo, DUE_TOMORROW_TAG_NAME, issue.number);
        await ok.addLabelToIssue(context.repo.owner, context.repo.repo, issue.number, [OVERDUE_TAG_NAME]);
      }
    }
    return {
      ok: true,
      issuesProcessed: results.length,
    }
  } catch (e) {
    core.setFailed(e.message);
    throw e;
  }
};

run();
