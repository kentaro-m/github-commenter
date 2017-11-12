import request from 'request-promise';
import getStdin from 'get-stdin';
import meow from 'meow';

const CIRCLECI = process.env.CIRCLECI || false;
const CI_PULL_REQUEST = process.env.CI_PULL_REQUEST || '';
const GITHUB_COMMENTER_API_TOKEN = process.env.GITHUB_COMMENTER_API_TOKEN || '';
const GITHUB_COMMENTER_API_URL = process.env.GITHUB_COMMENTER_API_URL || 'api.github.com';
const CIRCLE_PROJECT_REPONAME = process.env.CIRCLE_PROJECT_REPONAME || '';
const CIRCLE_PROJECT_USERNAME = process.env.CIRCLE_PROJECT_USERNAME || '';

function getPullRequestNumber(url) {
  if (url.match(/pull\/([0-9]+)/)) {
    const result = url.match(/pull\/([0-9]+)/);
    return result[1];
  }

  return '';
}

async function postMessage(prNumber, message) {
  try {
    const endpoint = `repos/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/issues/${prNumber}/comments`;

    const options = {
      method: 'POST',
      uri: `https://${GITHUB_COMMENTER_API_URL}/${endpoint}`,
      headers: {
        Authorization: `token ${GITHUB_COMMENTER_API_TOKEN}`,
        'User-Agent': 'github-commenter',
      },
      body: {
        body: message,
      },
      json: true,
    };

    const response = await request(options);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function main() {
  const help = `
  Usage
    $ <input> | github-commenter

  Options
    --format, -f  Change comment format (text or code)
    --help, -h  Show help

  Examples
    $ echo hi | github-commenter
    Submitting a comment completed successfully.
    https://github.com/kentaro-m/github-commenter/pull/1#issuecomment-012345678
  `;
  const cli = meow(help, {
    flags: {
      format: { type: 'string', alias: 'f' },
      help: { type: 'boolean', alias: 'h' },
      version: { type: 'boolean', alias: 'v' },
    },
  });

  if (cli.flags.h) {
    cli.showHelp();
  }

  if (cli.flags.v) {
    console.log(cli.pkg.version);
    process.exit();
  }

  try {
    if (CIRCLECI && CI_PULL_REQUEST) {
      if (!cli.flags.format) {
        cli.flags.format = 'text';
      }

      /**
       * NOTE: the format option value is empty, a boolean returns
       * $ github-commenter --format
       */
      if ((cli.flags.format !== 'text' && cli.flags.format !== 'code') || cli.flags.format === true) {
        throw new Error('Format value is invalid.');
      }

      const stdin = await getStdin();

      if (!stdin) {
        throw new Error('No input value.');
      }

      const prNumber = getPullRequestNumber(CI_PULL_REQUEST);
      const result = cli.flags.format === 'text' ? stdin : `\`\`\`\n${stdin}\`\`\``;

      if (!prNumber) {
        throw new Error('Can\'t get a pull request number.');
      }

      const response = await postMessage(prNumber, result);
      console.log(`Submitting a comment completed successfully.\n${response.html_url}`);
    } else {
      throw new Error('Your environment is not supported.');
    }
  } catch (error) {
    console.log(error.message);
    cli.showHelp();
  }
}

main();
