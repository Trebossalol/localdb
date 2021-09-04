import { DbConfig, EntryInterface } from './types';
/**
 * @class Database
 * @constructor
 * @param config Configuration for the database, a dbPath property is required
 * @param collections Collections which are in this database
 * @description A database can hold collections and allows easy access to each collection, every collection is available via the Database.collections property or via the Database.access method
 */
export default class Database<Entries extends EntryInterface<Entries>> {
    dbName: string;
    private entries;
    config: DbConfig<Entries>;
    constructor(name: string, config: DbConfig<Entries>);
    /**
     * @description Initalizes the collection db files
     * @returns Promise<void>
     */
    start(): Promise<void>;
    /**
     *
     * @param {string} name Name of the entry to access
     * @returns Collection | Map
     * @description Access an entry in your database
     */
    access<N extends keyof Entries>(name: N): Entries[N];
}
//# sourceMappingURL=Database.d.ts.map