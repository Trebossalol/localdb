# Documentation for Multi collection DB (Recommended)

> If you want a wrapper for your collections, use the `Database` constructor

First, import the required classes:

```javascript
import { Collection, Database } from '@trebossa/localdb'
```

Define a main interface which represents your database

```javascript
interface User {
  username: string;
}

interface DB {
  accounts: Collection<User>;
}
```

Create a db instance and start it:

```javascript
const db =
  new Database() <
  DB >
  ('my-project',
  {
    absolutePath: path.resolve('./_test/db'),
  },
  [new Collection('accounts')])

await db.start()
```

Insert documents into your database:

```javascript
await db.access('accounts').insert({
  username: 'trebossa',
  password: 'MY_SUPER_SECURE_PASSWORD',
})
```

In this case, you will get autocompletion for the `User` type

Update documents with a query:

```javascript
await db.access('accounts').update(
  { username: 'trebossa' },
  {
    $set: {
      password: 'SOME_NEW_PASSWORD',
    },
  }
)
```

Every atomic operator in the `update` parameter behave different.

Read values from the database

```javascript
await db.access('accounts').findOne({ username: 'trebossa' })
await db.access('accounts').find({ username: 'trebossa' })
```

Create a document and have a reference to that element in the collection, you can update it easily (Auto-syncs the object reference)

```javascript
const newAccount = db.access('accounts').createDocument({
  username: 'tom',
  password: 'SOME_OTHER_PASSWORD',
})

await newAccount.insert()
```
