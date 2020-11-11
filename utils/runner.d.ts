import execa from "execa";
export interface Options {
    dry: boolean;
    debug: boolean;
    ignorePattern?: string;
    print?: boolean;
    runInBand?: boolean;
}
export declare function run(transform: string, paths: string, options: Options): execa.ExecaChildProcess<string>;
export declare function buildRunner(transform: string): (paths: string, options: Options) => execa.ExecaChildProcess<string>;
