import Collection from './Collection';
import { DocumentOptions, Searchquery, DocumentLike, AtomicOperator, DocumentInsertOptions } from '../types';
/**
 * @class Document
 * @constructor
 * @param document Document to insert
 * @param config Optional configuration for the document (It is recommended to specify a collection)
 * @description A document wrapper, which can be used to insert and query data from the database
 */
export default class Document<DocType = any> {
    doc: DocumentLike<DocType>;
    config: DocumentOptions<DocType>;
    private _docId;
    constructor(document: DocType, config?: DocumentOptions<DocType>);
    private _getColl;
    private _getSearchQuery;
    private syncDocId;
    /**
     * @description Insert the document into a collection
     * @param collection Optional collection, where to insert the document (default: `Document.config.collection`)
     * @returns void
     */
    insert(config?: DocumentInsertOptions, collection?: Collection<DocType>): Promise<DocumentLike<DocType>>;
    /**
     * @description Update the document
     * @param update Atomic operators which can perform different updates to the document
     * @param collection Optional collection, where to update the document (default: `#Document.config.collection)
     */
    update(update: AtomicOperator<DocType>, collection?: Collection<DocType>): Promise<void>;
    /**
     * @param query Optional search query of the document
     * @param collection Optional collection, where to retrieve the document (default: `#Document.config.collection`)
     * @description Returns the document which matches the query
     * @returns DocType
     */
    fromDb(query: Searchquery, collection?: Collection<DocType>): Promise<DocumentLike<DocType>>;
    /**
     * @description Sync the database with the Document instance
     * @param query Optional search query of the document to be queried
     * @param collection Optional collection, where to retrieve the document (default: `#Document.config.collection`)
     * @returns
     */
    sync(query?: Searchquery, collection?: Collection<DocType>): Promise<void>;
}
//# sourceMappingURL=Document.d.ts.map