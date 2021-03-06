import { mkdirSync, writeFileSync } from 'fs'
import { resolve, join } from 'path'
import { MapConfig } from '../types'
import { readFile, writeFile, exists, mkdir, readdir } from '../Util'

/**
 * @class Map
 * @constructor
 * @param {string} name The name of the map
 * @param {config} config Optional configuration settings, which will be overwritten when the map is inside a database
 * @description Creates a key-value store
 */
export default class Map<Template = any> {
    public name: string;
    public config: MapConfig<Template>;
    
    constructor(name: string, config?: MapConfig<Template>) {
        this.name = name
        this.config = config;
        if (config.folderPath == null) this.config.folderPath = './db'
    }

    /**
     * @description Create the map-relevant files
     */
    async initalize(): Promise<Map<Template>> {
        const storagePath = this._getPath()
        const storageExists = await exists(storagePath)

        if (!storageExists) {
            mkdirSync(resolve(this.config.folderPath), { recursive: true })
            writeFileSync(storagePath, this._stringify(this.config.template))
        } else if (this.config.onRestartBehaviour === 'OVERWRITE') await writeFile(storagePath, this._stringify({}))
        return this
    }

    /**
     * @description Get the filename associated to the map
     */
    private _getFilename(): string {
        const getFileName = this.config.fileNameGenerator
        if (getFileName) return getFileName(this as Map<Template>)
        return `${this.name}.json`
    }

    /**
     * @description Get the folder path, where the file is located
     */
    private _getPath(): string {
        return join(this.config.folderPath, this._getFilename())
    }

    /**
     * @description Get the storaged value
     */
    private async _getStorage(): Promise<Template> {

        async function overwrite(): Promise<void> {
            await writeFile(this._getPath(), this._getJson({}))
        }

        try {
            const storage = await readFile(this._getPath(), 'utf8')
            const parsed = JSON.parse(storage) as Template
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
                return {} as Template
            } else if (this.config.onErrorBehaviour == 'OVERWRITE') await overwrite()
            else throw new Error(`Invalid local db file at KeyValueStorage: ${e}`) 
        }
    }

    /**
     * @description Stringify the object using the normalization
     */
    private _stringify(data: Partial<Template>): string {
        const normalize = this.config.normalize
        return normalize != null ? normalize(data) : JSON.stringify(data, null, 3)
    }

    /**
     * @description Store the data into the json file
     */
    private async _store(data: Template): Promise<void> {
        const json = this._stringify(data)
        await writeFile(this._getPath(), json)
    }

    /**
     * @description Throw an exception
     */
    private _throwError(message: string): void {
        console.log(new Error(`Map: ${this.name} - ${message}`))
    }

    /**
     * @description Receive a value from the storage
     * @param key The objectg key of the entry
     * @returns Promise<Template[K]>
     */
    async get<K extends keyof Template>(key: K): Promise<Template[K]> {
        const json = await this._getStorage()
        return json[key]
    }

    /**
     * @returns Promise<void>
     * @param key The object key of the entry
     * @param value The value to replace the current one with
     * @description Replace values in the map
     */
    async set<K extends keyof Template>(key: K, value: Template[K]): Promise<void> {
        const json = await this._getStorage()
        json[key] = value
        await this._store(json)
    }

    /**
     * @description Delete an entry in your map
     * @returns Promise<void>
     * @param key The object key of the entry
     */
    async delete<K extends keyof Template>(key: K): Promise<void> {
        const json = await this._getStorage()
        delete json[key]
        await this._store(json)
    }

    /**
     * @description Check if an entry currently exists
     * @param key The object key of the entry
     * @returns Promise<boolean>
     */
    async has<K extends keyof Template>(key: K): Promise<boolean> {
        const v = await this.get(key)
        return v != null
    }

    /**
     * @description Retrieve the parsed json file raw
     * @returns Promise<Template>
     */
    async entries(): Promise<Template> {
        return this._getStorage() 
    }

    /**
     * @returns Promise<void>
     * @description Execute a callback on each entry in your map
     * @param callback Callback function which takes the value and the key
     */
    async forEach(callback: (value: any, key: string) => void): Promise<void> {
        const entries = await this._getStorage()
        Object.entries(entries).forEach(([key, value]) => callback(value, key))
    }

    
}