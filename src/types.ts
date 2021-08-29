import Collection from './Collection'

/******************************************* */

export interface CollectionConfig {
    singleInstance?: boolean
    folderPath?: string
    normalize?: (doc: DocumentLike) => string
    docIdGenerator?: (doc: DocumentLike) => string
    fileNameGenerator?: (collection: Collection) => string
    onErrorBehaviour?: 'CREATE_BACKUP_AND_OVERWRITE' | 'OVERWRITE' | 'LOG_ERROR' | undefined
    onRestartBehaviour?: 'OVERWRITE' | undefined
}

export type DocId = string

export type Searchquery = DocumentLike

export interface DocumentLike<DocType = any> {
    _id?: string
    [key: string]: any
}

export type QueryCallback<DocType = any> = (doc: DocumentLike<DocType>) => (DocumentLike<DocType> | null)

export interface AtomicOperator<DocType> {
    $set?: { [k in keyof DocType]: DocType[k] }
    $push?: { [key: string]: any[] }
    $increase?: { [key: string]: number }
    $decrease?: { [key: string]: number }
    $rename?: [string, string][]
    $writeConcern?: DocumentLike<DocType>
    $each?: QueryCallback<DocType>
}

/******************************************* */

export interface DbConfig {
    absolutePath: string
    normalize?: (doc: DocumentLike) => string
}

export interface DbEntries {
    [key: string]: Collection
}

/******************************************* */

export interface DocumentOptions<DocType> {
    collection?: Collection<DocType>
    searchQuery?: Searchquery
}

export interface DocumentInsertOptions {
    writeConcern?: boolean
}