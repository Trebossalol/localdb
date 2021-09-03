"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var Util_1 = require("../Util");
/**
 * @class Map
 * @constructor
 * @param {string} name The name of the map
 * @param {config} config Optional configuration settings, which will be overwritten when the map is inside a database
 * @description Creates a key-value store
 */
var Map = /** @class */ (function () {
    function Map(name, config) {
        this.name = name;
        this.config = config;
        if (config.folderPath == null)
            this.config.folderPath = './db';
    }
    Map.prototype.initalize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var storagePath, storageExists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        storagePath = this._getPath();
                        return [4 /*yield*/, Util_1.exists(storagePath)];
                    case 1:
                        storageExists = _a.sent();
                        if (!!storageExists) return [3 /*break*/, 2];
                        fs_1.mkdirSync(path_1.resolve(this.config.folderPath), { recursive: true });
                        fs_1.writeFileSync(storagePath, this._stringify(this.config.template));
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(this.config.onRestartBehaviour === 'OVERWRITE')) return [3 /*break*/, 4];
                        return [4 /*yield*/, Util_1.writeFile(storagePath, this._stringify({}))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, this];
                }
            });
        });
    };
    Map.prototype._getFilename = function () {
        var getFileName = this.config.fileNameGenerator;
        if (getFileName)
            return getFileName(this);
        return this.name + ".json";
    };
    Map.prototype._getPath = function () {
        return path_1.join(this.config.folderPath, this._getFilename());
    };
    Map.prototype._getStorage = function () {
        return __awaiter(this, void 0, void 0, function () {
            function overwrite() {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, Util_1.writeFile(this._getPath(), this._getJson({}))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }
            var storage, parsed, e_1, backupFilePrefix_1, backupData, backupFolderPath, backupFolderExists, folder, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 14]);
                        return [4 /*yield*/, Util_1.readFile(this._getPath(), 'utf8')];
                    case 1:
                        storage = _a.sent();
                        parsed = JSON.parse(storage);
                        return [2 /*return*/, parsed];
                    case 2:
                        e_1 = _a.sent();
                        if (!(this.config.onErrorBehaviour == 'CREATE_BACKUP_AND_OVERWRITE')) return [3 /*break*/, 10];
                        backupFilePrefix_1 = 'bp';
                        return [4 /*yield*/, Util_1.readFile(this._getPath(), 'utf8')];
                    case 3:
                        backupData = _a.sent();
                        backupFolderPath = path_1.join(this.config.folderPath, '/backup');
                        return [4 /*yield*/, Util_1.exists(backupFolderPath)];
                    case 4:
                        backupFolderExists = _a.sent();
                        if (!!backupFolderExists) return [3 /*break*/, 6];
                        return [4 /*yield*/, Util_1.mkdir(backupFolderPath)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [4 /*yield*/, Util_1.readdir(backupFolderPath)];
                    case 7:
                        folder = _a.sent();
                        index = folder
                            .filter(function (e) { return e.split('_')[0] === backupFilePrefix_1; })
                            .map(function (e) { return Number(e.split('_')[1]); });
                        return [4 /*yield*/, Util_1.writeFile(path_1.join(backupFolderPath, backupFilePrefix_1 + "_" + (index.length == 0 ? 1 : Math.max.apply(Math, index) + 1) + "_" + this.name + ".json"), backupData)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, overwrite()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, {}];
                    case 10:
                        if (!(this.config.onErrorBehaviour == 'OVERWRITE')) return [3 /*break*/, 12];
                        return [4 /*yield*/, overwrite()];
                    case 11:
                        _a.sent();
                        return [3 /*break*/, 13];
                    case 12: throw new Error("Invalid local db file at KeyValueStorage: " + e_1);
                    case 13: return [3 /*break*/, 14];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    Map.prototype._stringify = function (data) {
        var normalize = this.config.normalize;
        return normalize != null ? normalize(data) : JSON.stringify(data, null, 3);
    };
    Map.prototype._store = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        json = this._stringify(data);
                        return [4 /*yield*/, Util_1.writeFile(this._getPath(), json)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description Receive a value from the storage
     * @param key The objectg key of the entry
     * @returns Promise<Template[K]>
     */
    Map.prototype.get = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getStorage()];
                    case 1:
                        json = _a.sent();
                        return [2 /*return*/, json[key]];
                }
            });
        });
    };
    /**
     * @returns Promise<void>
     * @param key The object key of the entry
     * @param value The value to replace the current one with
     * @description Replace values in the map
     */
    Map.prototype.set = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getStorage()];
                    case 1:
                        json = _a.sent();
                        json[key] = value;
                        return [4 /*yield*/, this._store(json)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description Delete an entry in your map
     * @returns Promise<void>
     * @param key The object key of the entry
     */
    Map.prototype.delete = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getStorage()];
                    case 1:
                        json = _a.sent();
                        delete json[key];
                        return [4 /*yield*/, this._store(json)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Map;
}());
exports.default = Map;
//# sourceMappingURL=Map.js.map