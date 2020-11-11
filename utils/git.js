'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = exports.message = exports.stashes = exports.commit = exports.status = exports.ahead = exports.branch = exports.dirty = exports.untracked = exports.isGit = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
// Prevent from failing on windows
const nullPath = /^win/.test(process.platform) ? 'nul' : '/dev/null';
// Consider EOL as \n because either Windows or *nix, this escape char will be there
const EOL = /\r?\n/;
function isGit(dir) {
    return fs_1.default.existsSync(path_1.default.join(dir, '.git'));
}
exports.isGit = isGit;
function untracked(repo, opts) {
    return status(repo, opts).untracked;
}
exports.untracked = untracked;
function dirty(repo, opts) {
    return status(repo, opts).dirty;
}
exports.dirty = dirty;
function branch(repo, opts) {
    opts = opts || {};
    try {
        const stdout = child_process_1.execSync('git show-ref >' + nullPath + ' 2>&1 && git rev-parse --abbrev-ref HEAD', { cwd: repo, maxBuffer: opts.maxBuffer }).toString();
        return stdout.trim();
    }
    catch (err) {
        if (err.code === 'ENOBUFS')
            throw err;
        return null; // most likely the git repo doesn't have any commits yet
    }
}
exports.branch = branch;
function ahead(repo, opts) {
    opts = opts || {};
    try {
        let stdout = child_process_1.execSync('git show-ref >' + nullPath + ' 2>&1 && git rev-list HEAD --not --remotes', { cwd: repo, maxBuffer: opts.maxBuffer }).toString();
        stdout = stdout.trim();
        return !stdout ? 0 : stdout.split(EOL).length;
    }
    catch (err) {
        if (err.code === 'ENOBUFS')
            throw err;
        return NaN;
    }
}
exports.ahead = ahead;
// Throws error
function status(repo, opts) {
    opts = opts || {};
    const stdout = child_process_1.execSync('git status -s', { cwd: repo, maxBuffer: opts.maxBuffer }).toString();
    const status = { dirty: 0, untracked: 0 };
    stdout.trim().split(EOL).filter(Boolean).forEach(function (file) {
        if (file.substr(0, 2) === '??')
            status.untracked++;
        else
            status.dirty++;
    });
    return status;
}
exports.status = status;
// Throws error
function commit(repo, opts) {
    opts = opts || {};
    const stdout = child_process_1.execSync('git rev-parse --short HEAD', { cwd: repo, maxBuffer: opts.maxBuffer }).toString();
    const commitHash = stdout.trim();
    return commitHash;
}
exports.commit = commit;
// Throws error
function stashes(repo, opts) {
    opts = opts || {};
    const stdout = child_process_1.execSync('git stash list', { cwd: repo, maxBuffer: opts.maxBuffer }).toString();
    const stashes = stdout.trim().split(EOL).filter(Boolean);
    return stashes.length;
}
exports.stashes = stashes;
// Throws error
function message(repo, opts) {
    opts = opts || {};
    return child_process_1.execSync('git log -1 --pretty=%B', { cwd: repo, maxBuffer: opts.maxBuffer }).toString().trim();
}
exports.message = message;
function check(repo, opts) {
    const statusResult = status(repo, opts);
    return {
        branch: branch(repo, opts),
        ahead: ahead(repo, opts),
        dirty: statusResult.dirty,
        untracked: statusResult.untracked,
        stashes: stashes(repo, opts)
    };
}
exports.check = check;
//# sourceMappingURL=git.js.map