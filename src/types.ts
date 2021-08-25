import Collection from './Collection'

/******************************************* */

export interface CollectionConfig {
    singleInstance?: boolean
    folderPath?: string
    normalize?: (doc: DocumentLike) => string
    docIdGenerator?: (doc: DocumentLike) => string
    fileNameGenerator?: (collection: Collection) => string
    onErrorBehaviour?: 'CREATE_BACKUP_AND_OVERWRITE' | 'OVERWRITE' | 'LOG_ERROR'
    onRestartBehaviour?: 'OVERWRITE' | undefined
}

export type DocId = string

export type Searchquery = {
    [key: string]: any
    _id?: DocId
}

export type DocumentLike = { 
    [key: string]: any, 
    _id?: DocId 
}

export type QueryCallback = (doc: DocumentLike) => (DocumentLike | null)

export interface AtomicOperator {
    $set?: { [key: string]: any }
    $push?: { [key: string]: any[] }
    $increase?: { [key: string]: number }
    $decrease?: { [key: string]: number }
    $rename?: [string, string][]
    $writeConcern?: DocumentLike
    $each?: QueryCallback
}

/******************************************* */

export interface DbConfig {
    absolutPath: string
    normalize?: (doc: DocumentLike) => string
}

export interface DbEntries {
    [key: string]: Collection
}

/******************************************* */

export interface DocumentOptions {
    collection?: Collection
}