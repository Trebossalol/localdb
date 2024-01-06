"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var collection_1 = require("./localdb/collection");
var index_1 = require("./localdb/index");
var localdb = new index_1.LocalDB('test_db');
localdb.addCollection(new collection_1.Collection('users'));
console.log(localdb.database);
var users = localdb.collection('users');
localdb.database.get('users').create({
    username: 'test'
});
console.log(localdb.database);
console.log(users);
