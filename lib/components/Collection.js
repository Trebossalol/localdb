"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var Document_1 = __importDefault(require("./Document"));
var Util_1 = require("../Util");
/**
 * @class Collection
 * @constructor
 * @param {string} name The name of the collection
 * @param {configuration} config Optional configuration settings, which will be overwritten when the collection is inside a database
 * @description When used standalone without a database, the configuration.allone property must be set to true, otherwise the collection will wait for a configuration to be set manually.
 */
var Collection = /** @class */ (function () {
    function Collection(name, config) {
        if (config === void 0) { config = {}; }
        this.name = name;
        this.config = config;
        if (config.docIdGenerator == null)
            this.config.docIdGenerator = function () { return (Math.random() * (999999 - 111111) + 111111).toString(); };
        if (config.folderPath == null)
            this.config.folderPath = './db';
    }
    /**
     * @description Create the colection-relevant files
     */
    Collection.prototype.initalize = function () {
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
                        fs_1.writeFileSync(storagePath, this._stringify([]));
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(this.config.onRestartBehaviour === 'OVERWRITE')) return [3 /*break*/, 4];
                        return [4 /*yield*/, Util_1.writeFile(storagePath, this._stringify([]))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * @description Get the filename associated to the collection
     */
    Collection.prototype._getFilename = function () {
        var getFileName = this.config.fileNameGenerator;
        if (getFileName)
            return getFileName(this);
        return this.name + ".json";
    };
    /**
     * @description Get the folder path, where the file is located
     */
    Collection.prototype._getPath = function () {
        return path_1.join(this.config.folderPath, this._getFilename());
    };
    /**
     * @description Get the storaged value
     */
    Collection.prototype._getStorage = function () {
        return __awaiter(this, void 0, void 0, function () {
            function overwrite() {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, Util_1.writeFile(this._getPath(), this._getJson([]))];
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
                        return [2 /*return*/, []];
                    case 10:
                        if (!(this.config.onErrorBehaviour == 'OVERWRITE')) return [3 /*break*/, 12];
                        return [4 /*yield*/, overwrite()];
                    case 11:
                        _a.sent();
                        return [3 /*break*/, 13];
                    case 12: throw new Error("Invalid local db file at Collection: " + e_1);
                    case 13: return [3 /*break*/, 14];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description Stringify the object using the normalization
     */
    Collection.prototype._stringify = function (data) {
        var normalize = this.config.normalize;
        return normalize != null ? normalize(data) : JSON.stringify(data, null, 3);
    };
    /**
     * @description Store the data into the json file
     */
    Collection.prototype._store = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        json = this._stringify(data);
                        return [4 /*yield*/, Util_1.writeFile(this._getPath(), json)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * @description Execute a function on each document in the collection
     */
    Collection.prototype._queryAndStore = function (query, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var storage, entries, newStorage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getStorage()];
                    case 1:
                        storage = _a.sent();
                        entries = Object.entries(query);
                        newStorage = storage.map(function (document) {
                            var match = false;
                            function setMatch(expression) {
                                if (expression)
                                    match = true;
                            }
                            entries.forEach(function (_a) {
                                var key = _a[0], value = _a[1];
                                var splited = key.split('.');
                                switch (splited.length) {
                                    case 1:
                                        setMatch(document[key] === value);
                                        break;
                                    case 2:
                                        setMatch(document[splited[0]][splited[1]] === value);
                                        break;
                                    case 3:
                                        setMatch(document[splited[0]][splited[1]][splited[2]] === value);
                                        break;
                                    case 4:
                                        setMatch(document[splited[0]][splited[1]][splited[2]][splited[3]] === value);
                                        break;
                                    default:
                                        throw new Error('Object value can not be read, please use the following custom operator to perform actions to deeply nested values: $each');
                                }
                            });
                            if (!match)
                                return document;
                            return callback(document);
                        }).filter(function (e) { return e != null; });
                        return [4 /*yield*/, this._store(newStorage)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * @description Throw an exception
     */
    Collection.prototype._throwError = function (message) {
        console.log(new Error("Collection: " + this.name + " - " + message));
    };
    /**
     * @param document Document data
     * @returns Document<DocType>
     * @description Creates a document instance, which holds the document data and methods to update and read it
     */
    Collection.prototype.createDocument = function (document) {
        return new Document_1.default(document, {
            collection: this
        });
    };
    /**
     * @param {Document[]} documents The documents to be inserted into the collection
     * @returns Collection
     * @description Insert documents to the current collection
     */
    Collection.prototype.insert = function () {
        var documents = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            documents[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var storage;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getStorage()];
                    case 1:
                        storage = _a.sent();
                        documents = documents.map(function (doc) {
                            if (doc._id == null)
                                doc._id = _this.config.docIdGenerator(doc);
                            return doc;
                        });
                        storage.push.apply(storage, documents);
                        return [4 /*yield*/, this._store(storage)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, documents];
                }
            });
        });
    };
    /**
     * @param {Searchquery} query The search query for the document to update
     * @param {AtomicOperator} update Atomic operators which can perform different updates to the document
     * @returns Collection
     * @description Updates every document which matches the given query
     */
    Collection.prototype.update = function (query, update) {
        return __awaiter(this, void 0, void 0, function () {
            var entries;
            var _this = this;
            return __generator(this, function (_a) {
                entries = Object.entries(update);
                entries.forEach(function (_a) {
                    var atomicOperator = _a[0];
                    return __awaiter(_this, void 0, void 0, function () {
                        var _b, doc;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _b = atomicOperator;
                                    switch (_b) {
                                        case '$set': return [3 /*break*/, 1];
                                        case '$push': return [3 /*break*/, 3];
                                        case '$increase': return [3 /*break*/, 5];
                                        case '$decrease': return [3 /*break*/, 7];
                                        case '$modify': return [3 /*break*/, 9];
                                        case '$writeConcern': return [3 /*break*/, 11];
                                    }
                                    return [3 /*break*/, 15];
                                case 1: return [4 /*yield*/, this._queryAndStore(query, function (document) { return (__assign(__assign({}, document), update.$set)); })];
                                case 2:
                                    _c.sent();
                                    return [3 /*break*/, 16];
                                case 3: return [4 /*yield*/, this._queryAndStore(query, function (document) {
                                        var $push = update.$push;
                                        Object.entries($push).forEach(function (_a) {
                                            var _b;
                                            var key = _a[0], arr = _a[1];
                                            if (Array.isArray(document[key]) === true)
                                                (_b = document[key]).push.apply(_b, arr);
                                        });
                                        return document;
                                    })];
                                case 4:
                                    _c.sent();
                                    return [3 /*break*/, 16];
                                case 5: return [4 /*yield*/, this._queryAndStore(query, function (document) {
                                        var entries = Object.entries(update.$increase);
                                        entries.forEach(function (_a) {
                                            var key = _a[0], increment = _a[1];
                                            document[key] += increment;
                                        });
                                        return document;
                                    })];
                                case 6:
                                    _c.sent();
                                    return [3 /*break*/, 16];
                                case 7: return [4 /*yield*/, this._queryAndStore(query, function (document) {
                                        var entries = Object.entries(update.$decrease);
                                        entries.forEach(function (_a) {
                                            var key = _a[0], decrement = _a[1];
                                            document[key] -= decrement;
                                        });
                                        return document;
                                    })];
                                case 8:
                                    _c.sent();
                                    return [3 /*break*/, 16];
                                case 9: return [4 /*yield*/, this._queryAndStore(query, update.$each)];
                                case 10:
                                    _c.sent();
                                    return [3 /*break*/, 16];
                                case 11: return [4 /*yield*/, this.findOne(query)];
                                case 12:
                                    doc = _c.sent();
                                    if (!(doc == null)) return [3 /*break*/, 14];
                                    return [4 /*yield*/, this.insert(update.$writeConcern)];
                                case 13:
                                    _c.sent();
                                    _c.label = 14;
                                case 14: return [3 /*break*/, 16];
                                case 15: throw new Error('Invalid atomic operator');
                                case 16: return [2 /*return*/];
                            }
                        });
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    /**
     * @param {Searchquery} querys Search queries to remove from this collection
     * @returns Collection
     * @description Deletes every document which matches the given query(s)
     */
    Collection.prototype.delete = function () {
        var querys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            querys[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a, querys_1, query;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = 0, querys_1 = querys;
                        _b.label = 1;
                    case 1:
                        if (!(_a < querys_1.length)) return [3 /*break*/, 4];
                        query = querys_1[_a];
                        return [4 /*yield*/, this._queryAndStore(query, function () { return null; })];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _a++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * @param {Searchquery} Search query for the documents
     * @returns document[] or an empty array
     * @description Read documents by a search query
     */
    Collection.prototype.find = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var storage, entries, queried;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getStorage()];
                    case 1:
                        storage = _a.sent();
                        entries = Object.entries(query);
                        queried = storage.filter(function (document) {
                            var match = false;
                            entries.forEach(function (_a) {
                                var key = _a[0], value = _a[1];
                                if (document[key] === value)
                                    match = true;
                            });
                            if (match)
                                return document;
                            return false;
                        });
                        return [2 /*return*/, queried];
                }
            });
        });
    };
    /**
     * @param {Searchquery} Search query for the document
     * @returns document or an empty array
     * @description Find the first document matching the query
     */
    Collection.prototype.findOne = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.find(query)];
                    case 1: return [2 /*return*/, (_a.sent())[0]];
                }
            });
        });
    };
    /**
     * @param {Searchquery} query Search query of the document to copy
     * @param {AtomicOperator} update optional atomic operators to perform on the copied object
     * @returns Collection
     * @description Copy the first queried document
     */
    Collection.prototype.copy = function (query, update) {
        return __awaiter(this, void 0, void 0, function () {
            var toCopy, _id, doc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(query)];
                    case 1:
                        toCopy = _a.sent();
                        _id = this.config.docIdGenerator(toCopy);
                        if (!toCopy) {
                            this._throwError('Document could not be queried');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.insert(__assign(__assign({}, toCopy), { _id: _id }))];
                    case 2:
                        doc = (_a.sent())[0];
                        if (!(update != undefined)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.update({ _id: _id }, update)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, doc];
                }
            });
        });
    };
    return Collection;
}());
exports.default = Collection;
//# sourceMappingURL=Collection.js.map