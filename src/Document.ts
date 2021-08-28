import Collection from './Collection'
import { DocumentOptions, Searchquery, DocumentLike } from './types'

/**
 * @class Document
 * @constructor
 * @param document Document to insert
 * @param config Optional configuration for the document (It is recommended to specify a collection)
 * @description A document wrapper, which can be used to insert and query data from the database
 */
export default class Document<T extends DocumentLike = DocumentLike> {
    doc: T
    config: DocumentOptions
    constructor(document: T, config?: DocumentOptions) {
        this.doc = document
        this.config = config
    }

    private _getColl(collection: Collection): Collection {
        let coll = collection || this.config.collection
        if (!coll) throw new Error('Collection not available')
        return coll
    }

    /**
     * @description Insert the document into a collection
     * @param collection Optional collection, where to insert the document (default: `Document.config.collection`)
     * @returns void
     */
    insert(collection?: Collection): void {
        const coll = this._getColl(collection)
        coll.insert(this.doc)
    }

    /**
     * 
     * @param searchquery Optional search query of the document to be queried (default: `Document.doc`)
     * @param collection Optional collection, where to query the document (default: `Document.config.collection`) 
     * @returns 
     */
    find(searchquery?: Searchquery, collection?: Collection) {
        const coll = this._getColl(collection)
        const query = searchquery || this.doc
        const data = coll.findOne<T>(query)
        return data as DocumentLike
    }
}