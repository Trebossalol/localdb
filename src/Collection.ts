import * as fs from 'fs'
import { resolve, join } from 'path'
import Document from './Document'
import { CollectionConfig, Searchquery, QueryCallback, DocumentLike,  AtomicOperator } from './types'
import { readFile, writeFile, exists, mkdir, readdir } from './Util'

/**
 * @class Collection
 * @constructor
 * @param {string} name The name of the collection
 * @param {configuration} config Optional configuration settings, which will be overwritten when the collection is inside a database
 * @description When used standalone without a database, the configuration.allone property must be set to true, otherwise the collection will wait for a configuration to be set manually.
 */
export default class Collection {
    public name: string;
    public config: CollectionConfig;
    
    constructor(name: string, config: CollectionConfig = {}) {
        this.name = name
        this.config = config;
        if (config.docIdGenerator == null) this.config.docIdGenerator = () => (Math.random() * (999999 - 111111) + 111111).toString()
        if (config.folderPath == null) this.config.folderPath = './db'
        if (config.singleInstance === true) this._updateStoragePath()
    }

    async _updateStoragePath(): Promise<Collection> {
        const storagePath = this._getPath()
        const storageExists = exists(storagePath)

        if (!storageExists) {
            await mkdir(resolve(this.config.folderPath), { recursive: true })
            await writeFile(storagePath, this._getJson([]))
        } else if (this.config.onRestartBehaviour === 'OVERWRITE') await writeFile(storagePath, this._getJson([]))
        return this
    }

    private _getFilename() {
        const getFileName = this.config.fileNameGenerator
        if (getFileName) return getFileName(this)
        return `collection.${this.name}.json`
    }

    private _getPath() {
        return join(this.config.folderPath, this._getFilename())
    }
    
    private async _getStorage(): Promise<any[]> {

        async function overwrite(): Promise<void> {
            await writeFile(this._getPath(), this._getJson([]))
        }

        try {
            const storage = await readFile(this._getPath())
            const parsed: any[] = JSON.parse(String(storage))
            return parsed    
        } catch(e) {
            if (this.config.onErrorBehaviour == 'CREATE_BACKUP_AND_OVERWRITE') {

                const backupFilePrefix = 'bp'
                const backupData = await readFile(this._getPath(), 'utf8')
                const backupFolderPath = join(this.config.folderPath, '/backup')
                const backupFolderExists = await exists(backupFolderPath)

                if (!backupFolderExists) await mkdir(backupFolderPath)

                const folder = await readdir(backupFolderPath)
                const index = folder
                    .filter(e => e.split('_')[0] === backupFilePrefix)
                    .map(e => Number(e.split('_')[1]))

                await writeFile(join(backupFolderPath, `${backupFilePrefix}_${index.length == 0 ? 1 : Math.max(...index) + 1}_${this.name}.json`), backupData)
                await overwrite()
            } else if (this.config.onErrorBehaviour == 'OVERWRITE') await overwrite()
            else throw new Error('Invalid localdb file')
        }
    }

    private _getJson(data: any): string {
        const normalize = this.config.normalize
        return normalize != null ? normalize(data) : JSON.stringify(data, null, 3)
    }

    private async _store(data: any) {
        const json = this._getJson(data)
        await writeFile(this._getPath(), json)
        return this
    }

    private async _queryAndStore(query: Searchquery, callback: QueryCallback): Promise<Collection> {
        let storage = await this._getStorage()
        const entries = Object.entries(query)

        let newStorage = storage.map((document: DocumentLike) => {
            let match = false

            function setMatch(expression: boolean) {
                if (expression) match = true
            }

            entries.forEach(([key, value]: [string, any]) => {
                const splited = key.split('.')
                switch(splited.length) {
                    case 1:
                        setMatch(document[key] === value)
                        break;
                    case 2:
                        setMatch(document[splited[0]][splited[1]] === value)
                        break;
                    case 3:
                        setMatch(document[splited[0]][splited[1]][splited[2]] === value)
                        break;
                    case 4:
                        setMatch(document[splited[0]][splited[1]][splited[2]][splited[3]] === value)
                        break;
                    default:
                        throw new Error('Object value can not be read, please use the following custom operator to perform actions to deeply nested values: $each')
                }
            })
            if (!match) return document
            return callback(document)
        }).filter(e => e != null)

        this._store(newStorage)
        return this
    }

    private _throwError(message: string): void {
        console.log(new Error(`Collection: ${this.name} - ${message}`))
    }

    /**
     * 
     * @param document Document data
     * @returns Document<T>
     * @description Creates a document instance, which holds the document data and methods to update and read it
     */
    createDocument<DocType extends DocumentLike = DocumentLike>(document: DocType): Document<DocType> {
       return new Document<DocType>(document, {
           collection: this
       })
    }

    /**
     * @param {Document[]} documents The documents to be inserted into the collection
     * @returns Collection
     * @description Insert documents to the current collection
     */
    async insert<DocType = any>(...documents: DocumentLike<DocType>[]): Promise<DocumentLike<DocType>[]> {
        let storage = await this._getStorage()
        documents = documents.map(doc => {
            if (doc._id == null) doc._id = this.config.docIdGenerator(doc)
            return doc
        })
        storage.push(...documents)
        this._store(storage)
        return documents
    }

    /**
     * @param {Searchquery} query The search query for the document to update
     * @param {AtomicOperator} update Atomic operators which can perform different updates to the document
     * @returns Collection
     * @description Updates every document which matches the given query
     */
    async update<DocType = any>(query: Searchquery, update: AtomicOperator<DocType>): Promise<Collection> {
        
        const entries = Object.entries(update)

        entries.forEach(async([atomicOperator]) => {
            switch(atomicOperator) {

                case '$set':
                    await this._queryAndStore(query, (document) => ({ ...document, ...update.$set }))
                    break

                case '$push':
                    await this._queryAndStore(query, (document) => {
                        const $push = update.$push
                        Object.entries($push).forEach(([key, arr]) => {
                            if (Array.isArray(document[key]) === true) document[key].push(...arr)
                        })
                        return document
                    })
                    break

                case '$increase': 
                    await this._queryAndStore(query, (document) => {
                        const entries = Object.entries(update.$increase)
                        entries.forEach(([key, increment]) => {
                            document[key] += increment
                        })
                        return document
                    })
                    break
            
                case '$decrease':
                    await this._queryAndStore(query, (document) => {
                        const entries = Object.entries(update.$decrease)
                        entries.forEach(([key, decrement]) => {
                            document[key] -= decrement
                        })
                        return document
                    }) 
                    break
            
                case '$rename':
                    await this._queryAndStore(query, (document) => {
                        update.$rename.forEach(([from, to]) => {
                            const value = document[from]
                            delete document[from]
                            document[to] = value
                        })
                        return document
                    })
                    break

                case '$modify':
                    await this._queryAndStore(query, update.$each)
                    break

                case '$writeConcern': 
                    const doc = await this.findOne<DocType>(query)
                    if (doc == null) await this.insert(update.$writeConcern)
                    
            }
        })
        return this
    }

    /**
     * @param {Searchquery} querys Search queries to remove from this collection
     * @returns Collection
     * @description Deletes every document which matches the given query(s)
     */
    async delete(...querys: Searchquery[]): Promise<Collection> {
        for (const query of querys) {
            await this._queryAndStore(query, () => null)
        }
        return this
    }

    /**
     * @param {Searchquery} Search query for the documents
     * @returns document[] or an empty array
     * @description Read documents by a search query 
     */
    async find<DocType = any>(query: Searchquery): Promise<DocType[]> {
        const storage = await this._getStorage()
        const entries = Object.entries(query)
        const queried: DocType[] = storage.filter(document => {
            let match = false
            entries.forEach(([key, value]) => {
                if (document[key] === value) match = true
            })
            if (match) return document
            return false
        })
        return queried
    }

    /**
     * @param {Searchquery} Search query for the document
     * @returns document or an empty array
     * @description Find the first document matching the query
     */
    async findOne<DocType = any>(query: Searchquery): Promise<DocType | null> {
        return (await this.find<DocType>(query))[0]
    }
 
    /**
     * @param {Searchquery} query Search query of the document to copy
     * @param {AtomicOperator} update optional atomic operators to perform on the copied object
     * @returns Collection
     * @description Copy the first queried document
     */
    async copy<DocType = any>(query: Searchquery, update: AtomicOperator<DocType> = null): Promise<Collection> {
        const toCopy: DocumentLike = await this.findOne<DocType>(query)
        const _id = this.config.docIdGenerator(toCopy)
        if (!toCopy) {
            this._throwError('Document could not be queried')
            return
        }
        await this.insert<DocType>({ ...toCopy, _id })
        if (update != null) await this.update<DocType>({ _id }, update)
        return this
    }
}