'use strict'

import fs from 'fs'
import path from 'path'
import { execSync, ExecSyncOptions} from 'child_process'

// Prevent from failing on windows
const nullPath = /^win/.test(process.platform) ? 'nul' : '/dev/null'

// Consider EOL as \n because either Windows or *nix, this escape char will be there
const EOL = /\r?\n/

export function isGit(dir: string) {
  return fs.existsSync(path.join(dir, '.git'))
}

export function untracked (repo: string, opts?: ExecSyncOptions) {
  return status(repo, opts).untracked
}

export function dirty (repo: string, opts?: ExecSyncOptions) {
  return status(repo, opts).dirty
}

export function branch (repo: string, opts?: ExecSyncOptions) {
  opts = opts || {}
  try {
    const stdout = execSync('git show-ref >' + nullPath + ' 2>&1 && git rev-parse --abbrev-ref HEAD', {cwd: repo, maxBuffer: opts.maxBuffer}).toString()
    return stdout.trim()
  } catch (err) {
    if (err.code === 'ENOBUFS') throw err
    return null // most likely the git repo doesn't have any commits yet
  }
}

export function ahead (repo: string, opts?: ExecSyncOptions) {
  opts = opts || {}
  try {
    let stdout = execSync('git show-ref >' + nullPath + ' 2>&1 && git rev-list HEAD --not --remotes', {cwd: repo, maxBuffer: opts.maxBuffer}).toString()
    stdout = stdout.trim()
    return !stdout ? 0 : stdout.split(EOL).length
  } catch (err) {
    if (err.code === 'ENOBUFS') throw err
    return NaN
  }
}

// Throws error
export function status(repo: string, opts?: ExecSyncOptions) {
  opts = opts || {}
  const stdout = execSync('git status -s', {cwd: repo, maxBuffer: opts.maxBuffer}).toString()
  const status = { dirty: 0, untracked: 0 }
  stdout.trim().split(EOL).filter(Boolean).forEach(function (file) {
    if (file.substr(0, 2) === '??') status.untracked++
    else status.dirty++
  })
  return status
}

// Throws error
export function commit (repo: string, opts?: ExecSyncOptions) {
  opts = opts || {}
  const stdout = execSync('git rev-parse --short HEAD', {cwd: repo, maxBuffer: opts.maxBuffer}).toString()
  const commitHash = stdout.trim()
  return commitHash
}

// Throws error
export function stashes (repo: string, opts?: ExecSyncOptions) {
  opts = opts || {}
  const stdout = execSync('git stash list', {cwd: repo, maxBuffer: opts.maxBuffer}).toString()
  const stashes = stdout.trim().split(EOL).filter(Boolean)
  return stashes.length
}

// Throws error
export function message (repo: string, opts?: ExecSyncOptions) {
  opts = opts || {}
  return execSync('git log -1 --pretty=%B', {cwd: repo, maxBuffer: opts.maxBuffer}).toString().trim()
}

export function check(repo: string, opts?: ExecSyncOptions) {
  const statusResult = status(repo, opts)
  return {
    branch: branch(repo, opts),
    ahead: ahead(repo, opts),
    dirty: statusResult.dirty,
    untracked: statusResult.untracked,
    stashes: stashes(repo, opts)
  }
}
