import * as fs from 'fs'
import { resolve, join } from 'path'
import Document from './Document'
import { CollectionConfig, Searchquery, QueryCallback, DocumentLike,  AtomicOperator } from './types'

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

    _updateStoragePath() {
        const storagePath = this._getPath()

        if (!fs.existsSync(storagePath)) {
            fs.mkdirSync(resolve(this.config.folderPath), { recursive: true })
            fs.writeFileSync(storagePath, this._getJson([]))
        } else if (this.config.onRestartBehaviour === 'OVERWRITE') fs.writeFileSync(storagePath, this._getJson([]))
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
    
    private _getStorage() {
        try {
            const storage = fs.readFileSync(this._getPath())
            const parsed = JSON.parse(String(storage))
            return parsed    
        } catch(e) {
            if (this.config.onErrorBehaviour == 'CREATE_BACKUP_AND_OVERWRITE') {
                const backupFilePrefix = 'backup'
                const backupData = fs.readFileSync(this._getPath(), 'utf8')
                const newIndex = (fs.readdirSync(this.config.folderPath)
                    .filter(e => e.split('-')[0] === backupFilePrefix)
                    .reduce((pv, cv) => parseInt(cv.split('-')[1]) + pv, 0)) + 1
                fs.writeFileSync(`${backupFilePrefix}-${newIndex}`, backupData)
            } else if (this.config.onErrorBehaviour == 'OVERWRITE') fs.writeFileSync(this._getPath(), this._getJson([]))
            else throw new Error('Invalid localdb file.')
        }
    }

    private _getJson(data: any): string {
        const normalize = this.config.normalize
        return normalize != null ? normalize(data) : JSON.stringify(data, null, 3)
    }

    private _store(data: any) {
        const json = this._getJson(data)
        fs.writeFileSync(this._getPath(), json)
        return this
    }

    private _queryAndStore(query: Searchquery, callback: QueryCallback) {
        let storage = this._getStorage()
        const entries = Object.entries(query)

        let newStorage = storage.map((document: DocumentLike) => {
            let match = false
            entries.forEach(([key, value]: [string, any]) => {

                function setMatch(expression: boolean) {
                    if (expression) match = true
                }

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
            let newDocument = callback(document)
            return newDocument
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
    insert<DocType = any>(...documents: DocumentLike<DocType>[]) {
        let storage = this._getStorage()
        documents = documents.map(doc => {
            if (doc._id == null) doc._id = this.config.docIdGenerator(doc)
            return doc
        })
        storage.push(...documents)
        this._store(storage)
        return this
    }

    /**
     * @param {Searchquery} query The search query for the document to update
     * @param {AtomicOperator} update Atomic operators which can perform different updates to the document
     * @returns Collection
     * @description Updates every document which matches the given query
     */
    update<DocType = any>(query: Searchquery, update: AtomicOperator<DocType>) {
        
        const entries = Object.entries(update)

        entries.forEach(([atomicOperator]) => {
            switch(atomicOperator) {

                case '$set':
                    this._queryAndStore(query, (document) => ({ ...document, ...update.$set }))
                    break

                case '$push':
                    this._queryAndStore(query, (document) => {
                        const $push = update.$push
                        Object.entries($push).forEach(([key, arr]) => {
                            if (Array.isArray(document[key]) === true) document[key].push(...arr)
                        })

                        return document
                    })
                    break

                case '$increase': 
                    this._queryAndStore(query, (document) => {
                        const entries = Object.entries(update.$increase)
                        entries.forEach(([key, increment]) => {
                            document[key] += increment
                        })

                        return document
                    })
                    break
            
                case '$decrease':
                    this._queryAndStore(query, (document) => {
                        const entries = Object.entries(update.$decrease)
                        entries.forEach(([key, decrement]) => {
                            document[key] -= decrement
                        })

                        return document
                    }) 
                    break
            
                case '$rename':
                    this._queryAndStore(query, (document) => {
                        update.$rename.forEach(([from, to]) => {
                            const value = document[from]
                            delete document[from]
                            document[to] = value
                        })

                        return document
                    })
                    break

                case '$modify':
                    this._queryAndStore(query, update.$each)
                    break

                case '$writeConcern': 
                    const doc = this.findOne(query)
                    if (doc == null) this.insert(update.$writeConcern)
            }
        })

        return this
    }

    /**
     * @param {Searchquery} querys Search queries to remove from this collection
     * @returns Collection
     * @description Deletes every document which matches the given query(s)
     */
    delete(...querys: Searchquery[]) {
        querys.forEach(query => this._queryAndStore(query, () => null))
        return this
    }

    /**
     * @param {Searchquery} Search query for the documents
     * @returns document[] or an empty array
     * @description Read documents by a search query 
     */
    find<T = any>(query: Searchquery): T[] {
        const storage = this._getStorage()
        const entries = Object.entries(query)
        const queried: T[] = storage.filter(document => {
            let match = false
            entries.forEach(([key, value]) => {
                if (document[key] === value) match = true
            })
            if (match) return document
        })
        return queried
    }

    /**
     * @param {Searchquery} Search query for the document
     * @returns document or an empty array
     * @description Find the first document matching the query
     */
    findOne<DocType = any>(query: Searchquery): DocType | null {
        return this.find<DocType>(query)[0]
    }
 
    /**
     * @param {Searchquery} query Search query of the document to copy
     * @param {AtomicOperator} update optional atomic operators to perform on the copied object
     * @returns Collection
     * @description Copy the first queried document
     */
    copy<DocType = any>(query: Searchquery, update: AtomicOperator<DocType> = null) {
        const toCopy: DocumentLike = this.findOne(query)[0]
        const _id = this.config.docIdGenerator(toCopy)
        if (!toCopy) return this._throwError('Document could not be queried')
        this.insert({ ...toCopy, _id })
        if (update != null) this.update({ _id }, update)
        return this
    }
}