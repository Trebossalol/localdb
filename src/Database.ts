import Collection from "./Collection";
import { DbConfig, CollectionConfig, DatabaseCollections } from './types'
import { existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'

type ValueOf<T> = T[keyof T];

interface DefaultEntries {
    accounts: Collection<{username:string}>
    [key: string]: Collection<any>
}

/**
 * @class Database
 * @constructor
 * @param config Configuration for the database, a dbPath property is required 
 * @param collections Collections which are in this database
 * @description A database can hold collections and allows easy access to each collection, every collection is available via the Database.collections property or via the Database.access method
 */
export default class Database<Entries> {
    public dbName: string
    private collections: DatabaseCollections<Entries>
    public config: DbConfig
    private collectionList: Collection[]

    constructor(dbName: string, config: DbConfig, collections: Collection[]) {
        this.dbName = dbName
        this.config = config
        this.collectionList = collections
        this.collections = {} as DatabaseCollections<Entries>
        
        if (!this.config.absolutePath) throw new Error('Database needs an absolute path beeing passed')
    }

    async start(): Promise<void> {
        
        const folderPath = resolve(this.config.absolutePath, this.dbName)

        if (existsSync(folderPath) === false) mkdirSync(folderPath, { recursive: true })

        const entries: any = {}

        for (let collection of this.collectionList) {
            collection.config.folderPath = folderPath
            await collection._updateStoragePath()
            entries[collection.name as keyof Entries] = collection
        }
    
        this.collections = entries as DatabaseCollections<Entries>
    }

    /**
     * 
     * @param {string} name Name of the collection to access
     * @returns Collection | null
     * @description Alternative way to access collections which are inside this database
     */
    public access(name: keyof Entries) {
        if (Object.keys(this.collections).length == 0) throw new Error('Could not access collection, did you initalize the Database via #Database.start() ?')
        return this.collections[name] as ValueOf<DatabaseCollections<Entries>> ?? null
    }
}