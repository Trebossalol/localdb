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
    initalize(): Promise<Map<Template>>;
    private _getFilename;
    private _getPath;
    private _getStorage;
    private _stringify;
    private _store;
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
}
//# sourceMappingURL=Map.d.ts.map