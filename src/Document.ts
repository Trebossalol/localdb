import Collection from './Collection'
import { DocumentOptions, Searchquery, DocumentLike } from './types'

export default class Document<T extends DocumentLike = DocumentLike> {
    doc: DocumentLike
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

    insert(collection?: Collection): void {
        const coll = this._getColl(collection)
        coll.insert(this.doc)
    }

    read(searchquery?: Searchquery, collection?: Collection): DocumentLike[] {
        const coll = this._getColl(collection)
        const query = searchquery || this.doc
        return coll.findOne<T>(query) as DocumentLike[]
    }
}