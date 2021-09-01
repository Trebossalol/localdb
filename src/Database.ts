import Collection from "./components/Collection";
import Map from "./components/Map";
import { DbConfig, DatabaseEntries, EntryInterface, ValueOf } from './types'
import { existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'

export type ValuesOf<T extends any[]>= T[number];

interface DefaultEntries {
    accounts: Collection<any>
    settings: Map<{}>
}


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

        const entries: any = {}

        const list = Object.values<Collection|Map>(this.config.entries)

        for (let entry of list) {
            const elem = this.config.entries[entry.name] as Entries[keyof Entries]
        
            elem.config.folderPath = folderPath
            
            await elem.initalize()
            entries[entry.name as keyof Entries] = entry
        }
    
        this.entries = entries as DatabaseEntries<Entries>
    }

    /**
     * 
     * @param {string} name Name of the entry to access
     * @returns Collection | Map
     * @description Access an entry in your database
     */
    public access<N extends keyof DatabaseEntries<Entries>>  (name: N) {
        if (Object.keys(this.entries).length == 0) throw new Error('Could not access collection, did you initalize the Database via #Database.start() ?')
        return this.entries[name] as Entries[N] ?? null
    }
}