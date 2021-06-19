/* eslint-disable global-require, no-console */

const fs = require('fs');
const spawnSync = require('child_process').spawnSync;
const Moment = require('moment');

const BUILD_INFO_FILE = './.build-info.json';

require('../env.loader');

/**
 * Creates an error message that represents an error executing a spawned child
 * process.
 * @param {Object} proc The results object returned by
 * <code>child_process.spawn</code>.
 * @param {string|Array} desc An optional description of the: error that
 * occurred; or the scenario in which the error occurred.
 * @returns {string} An error message that represents an error executing a
 * spawned child process.
 */
function createErrorForSpawnedChild(proc, desc = '')
{
  const error = proc.error || { };
  const mesg = [ ];

  if (typeof error === 'string')
  {
    mesg.push('ERROR:', error);
  }
  else if ('message' in error)
  {
    mesg.push('ERROR:', error.message);
  }

  if (desc)
  {
    if (desc instanceof Array)
    {
      mesg.push(...desc);
    } else {
      mesg.push(desc);
    }
  }

  mesg.push('STATUS:', proc.status);
  mesg.push('STDERR:', proc.stderr);

  if ('stack' in error)
  {
    mesg.push('TRACE:', error.stack);
  }

  return mesg.join(' ');
}

/**
 * Returns the specified data field from the Git log data for the specified
 * commit.
 * @param {string} commit The commit to query.
 * @param {string} format The pretty format specifier to apply to the Git log
 * entry.
 * @returns {string} The specified data field from the Git log data for the
 * specified commit.
 */
function getGitLogDataForCommit(commit, formatSpecifier)
{
  const proc = spawnSync('git',
    ['log', `--pretty=format:%${formatSpecifier}`, '-n', '1', commit ]);

  /* 'git log' returns status 128 if the specified commit does not exist, so
     unfortunately we can't use status to determine if the command failed. */
  return proc.status === 0
    ? String(proc.stdout).replace(/\s*\n\s*/, '')
    : '';
}

/**
 * Returns the Git refs for branches or tags whose HEAD points to the specified
 * commit.
 * @param {string} commit The commit to query.
 * @param {boolean} isTag Indicates whether tag refs are to be queried, or if
 * not, branch refs.
 * @returns {string[]} An <code>Array</code> of <code>string</code> Git refs
 * for branches or tags whose HEAD points to the specified commit.
 */
function getGitBranchOrTagRefsForCommit(commit, isTag = false)
{
  const proc = spawnSync('git', [
    'log', '-n', '1', '--decorate=full', "--pretty=format:%D", commit ]);

  const refs = [ ];

  /* 'git log' returns status 128 if the specified commit does not exist, so
     unfortunately we can't use status to determine if the command failed. */
  if (proc.status > 0)
  {
    return refs;
  }

  /* e.g.: HEAD -> refs/heads/my_branch, tag: refs/tags/my_tag,
     refs/remotes/origin/my_branch */
  String(proc.stdout).replace(
    isTag
      ? / refs\/tags\/([^,\s]+)/g
      : / refs\/(?:heads|remotes\/[^/]+)\/([^,\s]+)/g,
    (match, ref) => { refs.push(ref); });

  /* Remove duplicate branch names from between local and remote branches. */
  return refs.filter((value, index, self) => self.indexOf(value) === index);
}

/**
 *
 * Returns the Git commit hash for the head of the current repository.
 * @returns {string} The Git commit hash for the head of the current
 * repository.
 */
function getGitCommitForHead()
{
  const proc = spawnSync('git', ['rev-parse', 'HEAD']);

  if (proc.status !== 0)
  {
    throw createErrorForSpawnedChild(proc, [
      'An error occurred while querying the commit hash of the Git',
      'repository head.' ]);
  }

  return String(proc.stdout).replace(/\s*\n\s*/, '');
}

/**
 *
 * Gets the Git version.
 * @returns {string} The Git version.
 */
function getGitVersion()
{
  const proc = spawnSync('git', ['--version']);

  if (proc.status !== 0)
  {
    throw createErrorForSpawnedChild(proc,
      'An error occurred while querying the version of git.');
  }

  return String(proc.stdout).replace(/\s*\n\s*/, '');
}

/**
 * Gets Git version information for the current repository.
 * @returns {Object} An object containing Git version information.
 */
function getGitInfo()
{
  const version = getGitVersion();
  const commit = getGitCommitForHead();
  const author = getGitLogDataForCommit(commit, 'aN');
  const date = getGitLogDataForCommit(commit, 'aI');
  const committer = getGitLogDataForCommit(commit, 'cN');
  const subject = getGitLogDataForCommit(commit, 's');
  const branches = getGitBranchOrTagRefsForCommit(commit);
  const tags = getGitBranchOrTagRefsForCommit(commit, true);

  return {
    version,
    commit: {
      hash: commit,
      author,
      date,
      committer,
      subject,
      branches,
      tags
    }
  };
}

/**
 * Gets build information to be reported by '/system/status'.
 * @returns {Object} An object containing build information.
 */
function getBuildInfo()
{
  return {
    git: getGitInfo(),
    date: new Moment(Date.now()).format() };
}

function writeBuildInfo()
{
  try {
    fs.writeFileSync(BUILD_INFO_FILE, JSON.stringify(getBuildInfo()));
    console.log('Build information successfully written.');
  } catch (err) {
    console.error('Failed to write build information', err);
  }
}

writeBuildInfo();
