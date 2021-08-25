import { Collection, Database } from './lib/index'
import * as path from 'path'

const db = new Database('mydb', {
    absolutPath: path.resolve('./_test/db') 
}, [
    new Collection('accounts'),
    new Collection('sessions')
])

const myAccount = db.access('accounts').createDocument({
    username: 'trebossa',
    password: 'MY_SUPER_SECURE_PASSWORD!',
    hobbys: []
})

myAccount.doc.hobbys.push('coding')
// myAccount.insert() 

db.collections.accounts.updateOne({ _id: myAccount.doc._id }, {
    $push: {
        hobbys: ['meet friends']
    }
})