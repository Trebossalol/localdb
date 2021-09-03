import { MapConfig, MapLike } from './types';
/**
 * @class Collection
 * @constructor
 * @param {string} name The name of the collection
 * @param {configuration} config Optional configuration settings, which will be overwritten when the collection is inside a database
 * @description When used standalone without a database, the configuration.allone property must be set to true, otherwise the collection will wait for a configuration to be set manually.
 */
export default class Map<Template = MapLike> {
    name: string;
    config: MapConfig;
    constructor(name: string, config?: MapConfig);
    _updateStoragePath(): Promise<Map<Template>>;
    private _getFilename;
    private _getPath;
    private _getStorage;
    private _getJson;
    private _store;
}
//# sourceMappingURL=Map.d.ts.map