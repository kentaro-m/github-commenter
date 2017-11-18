# github-commenter
[![npm](https://img.shields.io/npm/v/github-commenter.svg)](https://www.npmjs.com/package/github-commenter)
[![npm](https://img.shields.io/npm/dt/github-commenter.svg)](https://www.npmjs.com/package/github-commenter)
[![npm](https://img.shields.io/npm/l/github-commenter.svg)](https://www.npmjs.com/package/github-commenter)

Comment on the pull request with the value received from stdin on Circle CI.

##  Install
```
$ npm install -g github-commenter
```

## Usage
```
Comment on the pull request with the value received from stdin.

  Usage
    $ <input> | github-commenter

  Options
    --format, -f  Change comment format (text or code)
    --help, -h  Show help

  Examples
    $ echo hi | github-commenter
    Submitting a comment completed successfully.
    https://github.com/kentaro-m/github-commenter/pull/1#issuecomment-012345678
```

### How to execute github-commenter command
```
$ echo hi | github-commenter
# enable code blocks
$ echo "console.log('Hello, world.');" | github-commenter --format code
```
Please give the input value with standard input using pipe.

* **CIRCLECI** Whether building with Circle CI (true o r false).
* **CI_PULL_REQUEST** If this build is part of only one pull request, its URL will be populated here. If there was more than one pull request, it will contain one of the pull request URLs (picked randomly).
* **CIRCLE_PROJECT_REPONAME** The repository name of the project being tested.
* **CIRCLE_PROJECT_USERNAME** The username or organization name of the project being tested.

github-commenter works with environment variables set by default in Circle CI.

[Using CircleCI Environment Variables - CircleCI](https://circleci.com/docs/1.0/environment-variables/)

### How to set up environment variables on Circle CI
* **GITHUB_COMMENTER_API_URL** A url for request the github api when using GitHub Enterprise `example.githubenterprise.com/api/v3` (Default: `api.github.com`)
* **GITHUB_COMMENTER_API_TOKEN** A token for submit a comment on pull requests (scope: repo)

Setting the above values as environment variable in Circle CI.

## Todo
* Support for Travis CI

## License
MIT
