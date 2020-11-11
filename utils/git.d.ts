/// <reference types="node" />
import { ExecSyncOptions } from 'child_process';
export declare function isGit(dir: string): boolean;
export declare function untracked(repo: string, opts?: ExecSyncOptions): number;
export declare function dirty(repo: string, opts?: ExecSyncOptions): number;
export declare function branch(repo: string, opts?: ExecSyncOptions): string;
export declare function ahead(repo: string, opts?: ExecSyncOptions): number;
export declare function status(repo: string, opts?: ExecSyncOptions): {
    dirty: number;
    untracked: number;
};
export declare function commit(repo: string, opts?: ExecSyncOptions): string;
export declare function stashes(repo: string, opts?: ExecSyncOptions): number;
export declare function message(repo: string, opts?: ExecSyncOptions): string;
export declare function check(repo: string, opts?: ExecSyncOptions): {
    branch: string;
    ahead: number;
    dirty: number;
    untracked: number;
    stashes: number;
};
