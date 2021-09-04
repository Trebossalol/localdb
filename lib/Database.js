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
/**
 * @class Database
 * @constructor
 * @param config Configuration for the database, a dbPath property is required
 * @param collections Collections which are in this database
 * @description A database can hold collections and allows easy access to each collection, every collection is available via the Database.collections property or via the Database.access method
 */
var Database = /** @class */ (function () {
    function Database(name, config) {
        this.dbName = name;
        this.config = config;
        this.entries = {};
        if (!this.config.absolutePath)
            throw new Error('Database needs an absolute path beeing passed');
    }
    /**
     * @description Initalizes the collection db files
     * @returns Promise<void>
     */
    Database.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var folderPath, entries, list, _i, list_1, entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        folderPath = path_1.resolve(this.config.absolutePath, this.dbName);
                        if (fs_1.existsSync(folderPath) === false)
                            fs_1.mkdirSync(folderPath, { recursive: true });
                        entries = {};
                        list = Object.values(this.config.entries);
                        _i = 0, list_1 = list;
                        _a.label = 1;
                    case 1:
                        if (!(_i < list_1.length)) return [3 /*break*/, 4];
                        entry = list_1[_i];
                        entry.config.folderPath = folderPath;
                        return [4 /*yield*/, entry.initalize()];
                    case 2:
                        _a.sent();
                        entries[entry.name] = entry;
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.entries = entries;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param {string} name Name of the entry to access
     * @returns Collection | Map
     * @description Access an entry in your database
     */
    Database.prototype.access = function (name) {
        if (Object.keys(this.entries).length == 0)
            throw new Error('Could not access collection, did you initalize the Database via #Database.start() ?');
        return this.entries[name];
    };
    return Database;
}());
exports.default = Database;
//# sourceMappingURL=Database.js.map