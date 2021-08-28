import { promisify } from 'util'
import { 
    readFile as FsReadFile,
    writeFile as FsWriteFile, 
    exists as FsExists,
    mkdir as FsMkdir,
    readdir as FsReaddir
} from 'fs'

export const readFile = promisify(FsReadFile)
export const writeFile = promisify(FsWriteFile)
export const exists = promisify(FsExists)
export const mkdir = promisify(FsMkdir)
export const readdir = promisify(FsReaddir)