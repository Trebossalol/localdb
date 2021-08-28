import Collection from './Collection'
import { DocumentOptions, Searchquery, DocumentLike, AtomicOperator, DocumentInsertOptions } from './types'

/**
 * @class Document
 * @constructor
 * @param document Document to insert
 * @param config Optional configuration for the document (It is recommended to specify a collection)
 * @description A document wrapper, which can be used to insert and query data from the database
 */
export default class Document<DocType extends DocumentLike = DocumentLike> {
    public doc: DocType
    public config: DocumentOptions
    private _docId: string | null

    constructor(document: DocType, config?: DocumentOptions) {
        this.doc = document
        this.config = config
        this._docId = null

        if (config.searchQuery) this.syncDocId()
    }

    private _getColl(collection?: Collection): Collection {
        let coll = collection ?? this.config.collection
        if (!coll) throw new Error('Collection not available, if this `Document` instance is not create via `Collection` you need to pass a collection in the config parameter')
        return coll
    }

    private _getSearchQuery(query?: Searchquery): Searchquery {
        let _query = query ?? this.config.searchQuery
        if (!_query) return this.doc
        return _query 
    }

    private async syncDocId(query?: Searchquery): Promise<void> {
        const doc = await this.config.collection.findOne<DocType>(this._getSearchQuery(query))
        this._docId = doc._id
    }

    /**
     * @description Insert the document into a collection
     * @param collection Optional collection, where to insert the document (default: `Document.config.collection`)
     * @returns void
     */
    async insert(config?: DocumentInsertOptions, collection?: Collection): Promise<DocumentLike<DocType>> {
        const coll = this._getColl(collection)
        const searchQuery = this._getSearchQuery()
        if (config && config.writeConcern === true) {
            await this.config.collection.update<DocType>(this._getSearchQuery(), {
                $writeConcern: this.doc
            })
            const doc = await this.fromDb(searchQuery, coll)
            await this.sync()
            return doc
        } else {
            const doc =  await coll.insert<DocType>(this.doc)[0]
            await this.sync()
            return doc
        }
    }

    /**
     * @description Update the document
     * @param update Atomic operators which can perform different updates to the document
     * @param collection Optional collection, where to update the document (default: `#Document.config.collection)
     */
    async update(update: AtomicOperator<DocType>, collection?: Collection) {
        await this._getColl(collection).update(this._getSearchQuery(), update)
        await this.sync()
    }

    /**
     * @param query Optional search query of the document
     * @param collection Optional collection, where to retrieve the document (default: `#Document.config.collection`)
     * @description Returns the document which matches the query
     * @returns DocType
     */
    async fromDb(query: Searchquery, collection?: Collection): Promise<DocType> {
        const coll = this._getColl(collection)
        return await coll.findOne<DocType>(this._getSearchQuery(query))
    }

    /**
     * @description Sync the database with the Document instance
     * @param query Optional search query of the document to be queried
     * @param collection Optional collection, where to retrieve the document (default: `#Document.config.collection`)
     * @returns 
     */
    async sync(query?: Searchquery, collection?: Collection): Promise<void> {
        const doc = await this.fromDb(this._getSearchQuery(query), collection)
        if (!doc) return
        this.doc = doc
        this.config.searchQuery = { _id: doc._id }
    }
}