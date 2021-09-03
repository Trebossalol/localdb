import Collection from './components/Collection';
import Map from './components/Map';
export declare type ValueOf<T> = T[keyof T];
export declare type AtLeastOne<T, U = {
    [K in keyof T]: Pick<T, K>;
}> = Partial<T> & U[keyof U];
export declare type Required<T> = {
    [P in keyof T]-?: T[P];
};
export declare type KeysMatching<T, V> = {
    [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
/******************************************* */
export interface CollectionConfig {
    folderPath?: string;
    normalize?: (doc: DocumentLike) => string;
    docIdGenerator?: (doc: DocumentLike) => string;
    fileNameGenerator?: (collection: Collection) => string;
    onErrorBehaviour?: 'CREATE_BACKUP_AND_OVERWRITE' | 'OVERWRITE' | 'LOG_ERROR' | undefined;
    onRestartBehaviour?: 'OVERWRITE' | undefined;
}
export declare type DocId = string;
export declare type Searchquery<DocType extends Partial<any> = any> = DocumentLike<Partial<DocType>>;
export declare type DocumentLike<DocType = any> = {
    _id?: string;
} & DocType;
export declare type QueryCallback<DocType = any> = (doc: DocumentLike<DocType>) => (DocumentLike<DocType> | null);
export declare type AtomicOperator<DocType extends DocumentLike> = AtLeastOne<{
    $set: Partial<{
        [k in keyof DocType]: DocType[k];
    }>;
    $push: {
        [key: string]: any[];
    };
    $increase: Partial<{
        [key: string]: number;
    }>;
    $decrease: {
        [key: string]: number;
    };
    $writeConcern: DocumentLike<DocType>;
    $each: QueryCallback<DocType>;
}>;
/******************************************* */
export declare type DatabaseEntries<E> = {
    [K in keyof E]: E[K];
};
export declare type EntryInterface<E> = {
    [K in keyof E]: Collection | Map;
};
export interface DbConfig<Entries extends EntryInterface<Entries>> {
    absolutePath: string;
    normalize?: (doc: DocumentLike) => string;
    collectionConfig?: CollectionConfig;
    entries: Entries;
}
/******************************************* */
export interface DocumentOptions<DocType> {
    collection?: Collection<DocType>;
    searchQuery?: Searchquery;
}
export interface DocumentInsertOptions {
    writeConcern?: boolean;
}
/******************************************* */
export interface MapConfig<Template extends Object> {
    template?: Template;
    folderPath?: string;
    normalize?: (storage: Partial<Template>) => string;
    fileNameGenerator?: (storage: Map<Template>) => string;
    onErrorBehaviour?: 'CREATE_BACKUP_AND_OVERWRITE' | 'OVERWRITE' | 'LOG_ERROR' | undefined;
    onRestartBehaviour?: 'OVERWRITE' | undefined;
}
export declare type MapSetCallback<Template> = (x: Template) => Template;
//# sourceMappingURL=types.d.ts.map