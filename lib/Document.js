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
/**
 * @class Document
 * @constructor
 * @param document Document to insert
 * @param config Optional configuration for the document (It is recommended to specify a collection)
 * @description A document wrapper, which can be used to insert and query data from the database
 */
var Document = /** @class */ (function () {
    function Document(document, config) {
        this.doc = document;
        this.config = config;
        this._docId = null;
        if (config.searchQuery)
            this.syncDocId();
    }
    Document.prototype._getColl = function (collection) {
        var coll = collection !== null && collection !== void 0 ? collection : this.config.collection;
        if (!coll)
            throw new Error('Collection not available, if this `Document` instance is not create via `Collection` you need to pass a collection in the config parameter');
        return coll;
    };
    Document.prototype._getSearchQuery = function (query) {
        var _query = query !== null && query !== void 0 ? query : this.config.searchQuery;
        if (!_query)
            return this.doc;
        return _query;
    };
    Document.prototype.syncDocId = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var doc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.config.collection.findOne(this._getSearchQuery())];
                    case 1:
                        doc = _a.sent();
                        this._docId = doc._id;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description Insert the document into a collection
     * @param collection Optional collection, where to insert the document (default: `Document.config.collection`)
     * @returns void
     */
    Document.prototype.insert = function (config, collection) {
        return __awaiter(this, void 0, void 0, function () {
            var coll, searchQuery, doc, doc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        coll = this._getColl(collection);
                        searchQuery = this._getSearchQuery();
                        if (!(config && config.writeConcern === true)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.config.collection.update(this._getSearchQuery(), {
                                $writeConcern: this.doc
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.fromDb(searchQuery, coll)];
                    case 2:
                        doc = _a.sent();
                        return [4 /*yield*/, this.sync()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, doc];
                    case 4: return [4 /*yield*/, coll.insert(this.doc)[0]];
                    case 5:
                        doc = _a.sent();
                        return [4 /*yield*/, this.sync()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, doc];
                }
            });
        });
    };
    /**
     * @description Update the document
     * @param update Atomic operators which can perform different updates to the document
     * @param collection Optional collection, where to update the document (default: `#Document.config.collection)
     */
    Document.prototype.update = function (update, collection) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getColl(collection).update(this._getSearchQuery(), update)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.sync()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @param query Optional search query of the document
     * @param collection Optional collection, where to retrieve the document (default: `#Document.config.collection`)
     * @description Returns the document which matches the query
     * @returns DocType
     */
    Document.prototype.fromDb = function (query, collection) {
        return __awaiter(this, void 0, void 0, function () {
            var coll;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        coll = this._getColl(collection);
                        return [4 /*yield*/, coll.findOne(this._getSearchQuery(query))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @description Sync the database with the Document instance
     * @param query Optional search query of the document to be queried
     * @param collection Optional collection, where to retrieve the document (default: `#Document.config.collection`)
     * @returns
     */
    Document.prototype.sync = function (query, collection) {
        return __awaiter(this, void 0, void 0, function () {
            var doc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fromDb(this._getSearchQuery(query), collection)];
                    case 1:
                        doc = _a.sent();
                        if (!doc)
                            return [2 /*return*/];
                        this.doc = doc;
                        this.config.searchQuery = { _id: doc._id };
                        return [2 /*return*/];
                }
            });
        });
    };
    return Document;
}());
exports.default = Document;
//# sourceMappingURL=Document.js.map