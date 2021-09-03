/// <reference types="node" />
import { readFile as FsReadFile, writeFile as FsWriteFile, exists as FsExists, mkdir as FsMkdir, readdir as FsReaddir } from 'fs';
export declare const readFile: typeof FsReadFile.__promisify__;
export declare const writeFile: typeof FsWriteFile.__promisify__;
export declare const exists: typeof FsExists.__promisify__;
export declare const mkdir: typeof FsMkdir.__promisify__;
export declare const readdir: typeof FsReaddir.__promisify__;
//# sourceMappingURL=Util.d.ts.map