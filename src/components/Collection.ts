import { mkdirSync, writeFileSync } from 'fs'
import { resolve, join } from 'path'
import Document from './Document'
import { CollectionConfig, Searchquery, QueryCallback, DocumentLike,  AtomicOperator } from '../types'
import { readFile, writeFile, exists, mkdir, readdir } from '../Util'

/**
 * @class Collection
 * @constructor
 * @param {string} name The name of the collection
 * @param {configuration} config Optional configuration settings, which will be overwritten when the collection is inside a database
 * @description When used standalone without a database, the configuration.allone property must be set to true, otherwise the collection will wait for a configuration to be set manually.
 */
export default class Collection<DocType = DocumentLike, Name = any> {
    public name: Name;
    public config: CollectionConfig;
    
    constructor(name: Name, config: CollectionConfig = {}) {
        this.name = name
        this.config = config;
        if (config.docIdGenerator == null) this.config.docIdGenerator = () => (Math.random() * (999999 - 111111) + 111111).toString()
        if (config.folderPath == null) this.config.folderPath = './db'
    }

    async initalize(): Promise<Collection> {
        const storagePath = this._getPath()
        const storageExists = await exists(storagePath)

        if (!storageExists) {
            mkdirSync(resolve(this.config.folderPath), { recursive: true })
            writeFileSync(storagePath, this._stringify([]))
        } else if (this.config.onRestartBehaviour === 'OVERWRITE') await writeFile(storagePath, this._stringify([]))
        return this
    }

    private _getFilename(): string {
        const getFileName = this.config.fileNameGenerator
        if (getFileName) return getFileName(this as Collection)
        return `${this.name}.json`
    }

    private _getPath(): string {
        return join(this.config.folderPath, this._getFilename())
    }
    
    private async _getStorage(): Promise<DocumentLike<DocType>[]> {

        async function overwrite(): Promise<void> {
            await writeFile(this._getPath(), this._getJson([]))
        }

        try {
            const storage = await readFile(this._getPath(), 'utf8')
            const parsed = JSON.parse(storage) as DocumentLike<DocType>[]
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
                return [] as DocumentLike
            } else if (this.config.onErrorBehaviour == 'OVERWRITE') await overwrite()
            else throw new Error(`Invalid local db file at Collection: ${e}`) 
        }
    }

    private _stringify(data: Partial<DocumentLike<DocType>>[]): string {
        const normalize = this.config.normalize
        return normalize != null ? normalize(data) : JSON.stringify(data, null, 3)
    }

    private async _store(data: DocumentLike<DocType>[]): Promise<Collection<DocType>> {
        const json = this._stringify(data)
        await writeFile(this._getPath(), json)
        return this
    }

    private async _queryAndStore(query: Searchquery, callback: QueryCallback<DocType>): Promise<Collection<DocType>> {
        let storage = await this._getStorage()
        const entries = Object.entries(query)

        let newStorage = storage.map((document) => {
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

        await this._store(newStorage)
        return this
    }

    private _throwError(message: string): void {
        console.log(new Error(`Collection: ${this.name} - ${message}`))
    }

    /**
     * 
     * @param document Document data
     * @returns Document<DocType>
     * @description Creates a document instance, which holds the document data and methods to update and read it
     */
    createDocument(document: DocType): Document<DocType> {
       return new Document<DocType>(document, {
           collection: this
       })
    }

    /**
     * @param {Document[]} documents The documents to be inserted into the collection
     * @returns Collection
     * @description Insert documents to the current collection
     */
    async insert(...documents: DocumentLike<DocType>[]): Promise<DocumentLike<DocType>[]> {
        let storage = await this._getStorage()
        documents = documents.map(doc => {
            if (doc._id == null) doc._id = this.config.docIdGenerator(doc)
            return doc
        })
        storage.push(...documents)
        await this._store(storage)
        return documents
    }

    /**
     * @param {Searchquery} query The search query for the document to update
     * @param {AtomicOperator} update Atomic operators which can perform different updates to the document
     * @returns Collection
     * @description Updates every document which matches the given query
     */
    async update(query: Searchquery, update: AtomicOperator<DocType>): Promise<void> {
        
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
 
                case '$modify':
                    await this._queryAndStore(query, update.$each)
                    break

                case '$writeConcern': 
                    const doc = await this.findOne(query)
                    if (doc == null) await this.insert(update.$writeConcern)
                    break
                    
                default:
                    throw new Error('Invalid atomic operator')
            }
        })
    }

    /**
     * @param {Searchquery} querys Search queries to remove from this collection
     * @returns Collection
     * @description Deletes every document which matches the given query(s)
     */
    async delete(...querys: Searchquery[]): Promise<Collection<DocType>> {
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
    async find(query: Searchquery): Promise<DocumentLike<DocType[]>> {
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
    async findOne(query: Searchquery): Promise<DocumentLike<DocType> | null> {
        return (await this.find(query))[0]
    }
 
    /**
     * @param {Searchquery} query Search query of the document to copy
     * @param {AtomicOperator} update optional atomic operators to perform on the copied object
     * @returns Collection
     * @description Copy the first queried document
     */
    async copy(query: Searchquery, update?: AtomicOperator<DocType>): Promise<DocumentLike<DocType>> {
        const toCopy: DocumentLike = await this.findOne(query)
        const _id = this.config.docIdGenerator(toCopy)
        if (!toCopy) {
            this._throwError('Document could not be queried')
            return
        }
        const doc = (await this.insert({ ...toCopy, _id }))[0]
        if (update != undefined) await this.update({ _id }, update)
        return doc
    }
}