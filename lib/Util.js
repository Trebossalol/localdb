"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readdir = exports.mkdir = exports.exists = exports.writeFile = exports.readFile = void 0;
var util_1 = require("util");
var fs_1 = require("fs");
exports.readFile = util_1.promisify(fs_1.readFile);
exports.writeFile = util_1.promisify(fs_1.writeFile);
exports.exists = util_1.promisify(fs_1.exists);
exports.mkdir = util_1.promisify(fs_1.mkdir);
exports.readdir = util_1.promisify(fs_1.readdir);
//# sourceMappingURL=Util.js.map