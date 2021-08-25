import Collection from "./Collection";
import { DbConfig, CollectionConfig, DbEntries } from './types'
import * as fs from 'fs'

/**
 * @class Database
 * @constructor
 * @param config Configuration for the database, a dbPath property is required 
 * @param collections Collections which are in this database
 * @description A database can hold collections and allows easy access to each collection, every collection is available via the Database.collections property or via the Database.access method
 */
export default class Database {
    public dbName: string
    public collections: DbEntries
    public config: DbConfig

    constructor(dbName: string, configuration: DbConfig, collections: Collection[]) {
        this.dbName = dbName
        this.collections = {}
        this.config = configuration

        if (!this.config.absolutPath) throw new Error('Database needs an absolute path beeing passed')
        this.initalizeCollection(configuration, ...collections)
    }

    private initalizeCollection(config: CollectionConfig, ...collections: Collection[]): void {
        const names = collections.map(e => e.name)
            
        names.forEach(name => {
            const collection: Collection = collections.find(e => e.name === name)
            this.collections[name] = collection
        })
        this.applyGlobals(this.config.absolutPath, config)

    }

    private applyGlobals(folderPath: string, configuration: CollectionConfig) {

        if (fs.existsSync(folderPath) === false) fs.mkdirSync(folderPath, { recursive: true })

        Object.keys(this.collections).forEach(collectionName => {
            const collection: Collection = this.collections[collectionName]

            this.collections[collectionName].config = { 
                ...collection.config,
                ...configuration, 
                fileNameGenerator: (collection) => `${this.dbName}-${collection.name}.json`,
                folderPath,
            }
            this.collections[collectionName]._updateStoragePath()
        })
    }

    /**
     * 
     * @param {string} name Name of the collection to access
     * @returns Collection | null
     * @description Alternative way to access collections which are inside this database
     */
    public access(name: string): Collection | null {
        return this.collections[name] ?? null
    }
}