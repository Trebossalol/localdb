import Collection from "./components/Collection";
import Map from "./components/Map";
import { DbConfig, EntryInterface, DatabaseEntries, ValueOf } from './types'
import { existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'

/**
 * @class Database
 * @constructor
 * @param config Configuration for the database, a dbPath property is required 
 * @param collections Collections which are in this database
 * @description A database can hold collections and allows easy access to each collection, every collection is available via the Database.collections property or via the Database.access method
 */
export default class Database<Entries extends EntryInterface<Entries>> {
    public dbName: string
    private entries: DatabaseEntries<Entries>
    public config: DbConfig<Entries>

    constructor(dbName: string, config: DbConfig<Entries>) {
        this.dbName = dbName
        this.config = config
        this.entries = {} as DatabaseEntries<Entries>
        
        if (!this.config.absolutePath) throw new Error('Database needs an absolute path beeing passed')
    }

    /**
     * @description Initalizes the collection db files
     * @returns Promise<void> 
     */
    async start(): Promise<void> {
        
        const folderPath = resolve(this.config.absolutePath, this.dbName)

        if (existsSync(folderPath) === false) mkdirSync(folderPath, { recursive: true })

        const entries = {} as DatabaseEntries<Entries>

        const list = Object.values<Collection|Map>(this.config.entries)

        for (let entry of list) {
            entry.config.folderPath = folderPath
            await entry.initalize()
            entries[entry.name] = entry
        }
    
        this.entries = entries as Entries
    }

    /**
     * 
     * @param {string} name Name of the entry to access
     * @returns Collection | Map
     * @description Access an entry in your database
     */
    public access<N extends keyof Entries>(name: N) {
        if (Object.keys(this.entries).length == 0) throw new Error('Could not access collection, did you initalize the Database via #Database.start() ?')
        return this.entries[name] as Entries[N]
    }
}