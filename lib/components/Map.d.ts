import { MapConfig } from '../types';
/**
 * @class Map
 * @constructor
 * @param {string} name The name of the map
 * @param {config} config Optional configuration settings, which will be overwritten when the map is inside a database
 * @description Creates a key-value store
 */
export default class Map<Template = any> {
    name: string;
    config: MapConfig<Template>;
    constructor(name: string, config?: MapConfig<Template>);
    /**
     * @description Create the map-relevant files
     */
    initalize(): Promise<Map<Template>>;
    /**
     * @description Get the filename associated to the map
     */
    private _getFilename;
    /**
     * @description Get the folder path, where the file is located
     */
    private _getPath;
    /**
     * @description Get the storaged value
     */
    private _getStorage;
    /**
     * @description Stringify the object using the normalization
     */
    private _stringify;
    /**
     * @description Store the data into the json file
     */
    private _store;
    /**
     * @description Throw an exception
     */
    private _throwError;
    /**
     * @description Receive a value from the storage
     * @param key The objectg key of the entry
     * @returns Promise<Template[K]>
     */
    get<K extends keyof Template>(key: K): Promise<Template[K]>;
    /**
     * @returns Promise<void>
     * @param key The object key of the entry
     * @param value The value to replace the current one with
     * @description Replace values in the map
     */
    set<K extends keyof Template>(key: K, value: Template[K]): Promise<void>;
    /**
     * @description Delete an entry in your map
     * @returns Promise<void>
     * @param key The object key of the entry
     */
    delete<K extends keyof Template>(key: K): Promise<void>;
    /**
     * @description Check if an entry currently exists
     * @param key The object key of the entry
     * @returns Promise<boolean>
     */
    has<K extends keyof Template>(key: K): Promise<boolean>;
    /**
     * @description Retrieve the parsed json file raw
     * @returns Promise<Template>
     */
    entries(): Promise<Template>;
    /**
     * @returns Promise<void>
     * @description Execute a callback on each entry in your map
     * @param callback Callback function which takes the value and the key
     */
    forEach(callback: (value: any, key: string) => void): Promise<void>;
}
//# sourceMappingURL=Map.d.ts.map