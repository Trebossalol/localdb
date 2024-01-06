import { createWriteStream, createReadStream, ReadStream, WriteStream, existsSync, mkdirSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { Collection } from './collection'

export class LocalDB {

    public readonly identifier: string

    private abortController: AbortController

    public database: Map<string, Collection>

    public get folderPath() {
        return join('databases', this.identifier)
    }

    public get filePath() {
        return join(this.folderPath, `${this.identifier}.json`)
    }

    /**
     * 
     * @param identifier Unique database name
     */
    constructor(identifier: string) {
        this.identifier = identifier
        this.abortController = new AbortController()
        this.database = new Map()
        
        this.__init()
    }

    public close() {
        this.abortController.abort("Connection closed")
    }

    private __init() {
        this.__initDatabase()
        this.__initFileStreams()
    }

    private createReadSteam() {
        return createReadStream(this.filePath, {
            autoClose: false,
            encoding: 'utf-8',
            signal: this.abortController.signal,
        })
    }

    private createWriteStream() {
        return createWriteStream(this.filePath, {
            autoClose: false,
            encoding: 'utf-8',
            signal: this.abortController.signal
        })
    }

    private __initDatabase() {

        // If database folder does not exist
        if (!existsSync(this.folderPath)) {
            mkdirSync(this.folderPath, {
                recursive: true
            })
        }

        // If database file does not exist
        if (!existsSync(this.filePath)) {
            writeFileSync(this.filePath, JSON.stringify([]))
        }

        // TODO: Can be parsed?
    }

    private async write() {
    }


    /**
     * @description Add a collection you want to add to the database
     * @param collection target collection
     */
    public addCollection(collection: Collection) {
        this.database.set(collection.name, collection)
        const ref = this.database.get(collection.name)

        const readSteam = this.createReadSteam()

        
    }

    /**
     * @description Get a handle to you collection
     * @param name target collection
     * @returns Collection
     */
    public collection<T extends Object = {}>(name: string) {
        return this.database.get(name) as Collection<T>
    }

}