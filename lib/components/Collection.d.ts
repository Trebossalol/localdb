import Document from './Document';
import { CollectionConfig, Searchquery, DocumentLike, AtomicOperator } from '../types';
/**
 * @class Collection
 * @constructor
 * @param {string} name The name of the collection
 * @param {configuration} config Optional configuration settings, which will be overwritten when the collection is inside a database
 * @description When used standalone without a database, the configuration.allone property must be set to true, otherwise the collection will wait for a configuration to be set manually.
 */
export default class Collection<DocType = DocumentLike, Name = any> {
    name: Name;
    config: CollectionConfig;
    constructor(name: Name, config?: CollectionConfig);
    initalize(): Promise<Collection>;
    private _getFilename;
    private _getPath;
    private _getStorage;
    private _stringify;
    private _store;
    private _queryAndStore;
    private _throwError;
    /**
     *
     * @param document Document data
     * @returns Document<DocType>
     * @description Creates a document instance, which holds the document data and methods to update and read it
     */
    createDocument(document: DocType): Document<DocType>;
    /**
     * @param {Document[]} documents The documents to be inserted into the collection
     * @returns Collection
     * @description Insert documents to the current collection
     */
    insert(...documents: DocumentLike<DocType>[]): Promise<DocumentLike<DocType>[]>;
    /**
     * @param {Searchquery} query The search query for the document to update
     * @param {AtomicOperator} update Atomic operators which can perform different updates to the document
     * @returns Collection
     * @description Updates every document which matches the given query
     */
    update(query: Searchquery, update: AtomicOperator<DocType>): Promise<void>;
    /**
     * @param {Searchquery} querys Search queries to remove from this collection
     * @returns Collection
     * @description Deletes every document which matches the given query(s)
     */
    delete(...querys: Searchquery[]): Promise<Collection<DocType>>;
    /**
     * @param {Searchquery} Search query for the documents
     * @returns document[] or an empty array
     * @description Read documents by a search query
     */
    find(query: Searchquery): Promise<DocumentLike<DocType[]>>;
    /**
     * @param {Searchquery} Search query for the document
     * @returns document or an empty array
     * @description Find the first document matching the query
     */
    findOne(query: Searchquery): Promise<DocumentLike<DocType> | null>;
    /**
     * @param {Searchquery} query Search query of the document to copy
     * @param {AtomicOperator} update optional atomic operators to perform on the copied object
     * @returns Collection
     * @description Copy the first queried document
     */
    copy(query: Searchquery, update?: AtomicOperator<DocType>): Promise<DocumentLike<DocType>>;
}
//# sourceMappingURL=Collection.d.ts.map