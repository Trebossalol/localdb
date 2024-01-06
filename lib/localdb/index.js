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
exports.LocalDB = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var LocalDB = /** @class */ (function () {
    /**
     *
     * @param identifier Unique database name
     */
    function LocalDB(identifier) {
        this.identifier = identifier;
        this.abortController = new AbortController();
        this.database = new Map();
        this.__init();
    }
    Object.defineProperty(LocalDB.prototype, "folderPath", {
        get: function () {
            return path_1.join('databases', this.identifier);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalDB.prototype, "filePath", {
        get: function () {
            return path_1.join(this.folderPath, this.identifier + ".json");
        },
        enumerable: false,
        configurable: true
    });
    LocalDB.prototype.close = function () {
        this.abortController.abort("Connection closed");
    };
    LocalDB.prototype.__init = function () {
        this.__initDatabase();
        this.__initFileStreams();
    };
    LocalDB.prototype.createReadSteam = function () {
        return fs_1.createReadStream(this.filePath, {
            autoClose: false,
            encoding: 'utf-8',
            signal: this.abortController.signal,
        });
    };
    LocalDB.prototype.createWriteStream = function () {
        return fs_1.createWriteStream(this.filePath, {
            autoClose: false,
            encoding: 'utf-8',
            signal: this.abortController.signal
        });
    };
    LocalDB.prototype.__initDatabase = function () {
        // If database folder does not exist
        if (!fs_1.existsSync(this.folderPath)) {
            fs_1.mkdirSync(this.folderPath, {
                recursive: true
            });
        }
        // If database file does not exist
        if (!fs_1.existsSync(this.filePath)) {
            fs_1.writeFileSync(this.filePath, JSON.stringify([]));
        }
        // TODO: Can be parsed?
    };
    LocalDB.prototype.write = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**
     * @description Add a collection you want to add to the database
     * @param collection target collection
     */
    LocalDB.prototype.addCollection = function (collection) {
        this.database.set(collection.name, collection);
        var ref = this.database.get(collection.name);
        var readSteam = this.createReadSteam();
    };
    /**
     * @description Get a handle to you collection
     * @param name target collection
     * @returns Collection
     */
    LocalDB.prototype.collection = function (name) {
        return this.database.get(name);
    };
    return LocalDB;
}());
exports.LocalDB = LocalDB;
