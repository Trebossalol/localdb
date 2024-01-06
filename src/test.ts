import { Collection } from './localdb/collection'
import { LocalDB } from './localdb/index'

const localdb = new LocalDB('test_db')

localdb.addCollection(
    new Collection('users')
)

console.log(localdb.database)

const users = localdb.collection<{username: string}>('users')

localdb.database.get('users').create({
    username: 'test'
})

console.log(localdb.database)
console.log(users)


