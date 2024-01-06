"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalDB = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var LocalDB = /** @class */ (function () {
    function LocalDB(identifier) {
        this.identifier = identifier;
        this.abortController = new AbortController();
        this.__init();
    }
    Object.defineProperty(LocalDB.prototype, "path", {
        get: function () {
            return path_1.join('databases', this.identifier);
        },
        enumerable: false,
        configurable: true
    });
    LocalDB.prototype.close = function () {
        this.abortController.abort("Connection closed");
    };
    LocalDB.prototype.__init = function () {
        this.__initFileStreams();
        this.__initDatabase();
    };
    LocalDB.prototype.__initFileStreams = function () {
        this.readStream = fs_1.createReadStream(this.path, {
            autoClose: false,
            encoding: 'utf-8',
            signal: this.abortController.signal,
        });
        this.writeStream = fs_1.createWriteStream(this.path, {
            autoClose: false,
            encoding: 'utf-8',
            signal: this.abortController.signal
        });
    };
    LocalDB.prototype.__initDatabase = function () {
        if (!fs_1.existsSync(this.path)) {
        }
    };
    return LocalDB;
}());
exports.LocalDB = LocalDB;
