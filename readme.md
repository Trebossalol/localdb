# Documentation for Multi collection DB

> If you need multiply collections for your project, you can use the `Database` wrapper.

First, import the required classes:

```javascript
import { Collection, Database } from '@trebossa/localdb'
```

If needed, you can also import the types for this library.

Create a database object and insert as many collections as you need:

```javascript
const db = new Database(
  'mydb',
  {
    absolutePath: path.resolve('./_test/db'),
  },
  [
	new Collection('accounts'), 
	new Collection('sessions')]
)
```

You can pass additional options to the `Database`- and `Collection` instance. In the `DbConfig` you must pass an absolut path, where the database should be saved and a method to normalize the JSON-Database output, which will be applied to every collection (default: `(doc) => JSON.stringify(doc, null, 3)`).

Insert documents into your database:

```javascript
db.collections.accounts.insert({
  username: 'trebossa',
  password: 'MY_SUPER_SECURE_PASSWORD',
})
```

You can pass more documents to the `Collection.insert` method.

Update documents with a query:

```javascript
db.access('accounts').update(
  { username: 'trebossa' },
  {
    $set: {
      password: 'SOME_NEW_PASSWORD',
    },
  }
)
```

You can use many atomic operators, in this example we'll use `$set` to overwrite the existing value, or create new values.

Read values from the database

```javascript
db.collections.accounts.findOne({ username: 'trebossa' })
db.collections.accounts.find({ username: 'trebossa' })
```

This always returns an array, so make sure to access the first `[0]` element.

Create a document and insert it when needed:

```javascript
const newAccount = db.access('accounts').createDocument({
  username: 'tom',
  password: 'SOME_OTHER_PASSWORD',
})

newAccount.insert()
```

# Documentation for single collection DB

> If you just need a single collection for your project, you don't need the `Database`

First, import the required classes:

```javascript
import { Collection } from '@trebossa/localdb'
```

If needed, you can also import the types for this library.

Create a collection instance

❗ Important: set in the config `singleInstance` to true, otherwise the `Collection` will not initalize itself

```javascript
const accounts = new Collection('accounts', {
  singleInstance: true,
})
```

The following options can also be passed

> `folderPath` - The relative path to the folder, where the collection-file will be stored (default: `./db`)
>
> `normalize` - A metehod which will normalize the JSON-file output (default: `(doc) => JSON.stringify(doc, null, 3)`)
>
> `docIdGenerator` - A method which will generate an `Document._id` for every document (default: `(doc) => string`)
>
> `fileNameGenerator` - A method which will generate the file-name of the JSON-file (default: `(collection: Collection) => string`)
>
> `onErrorBehaviour` - Tells the collection, how it should behave when errors occure (default: `undefined`)
>
> - `CREATE_BACKUP_AND_OVERWRITE'` - If set, the collection will backup itself and overwrite the normal db
> - `OVERWRITE` - If set, the collection will overwrite the db (you will loose all existing data)
> - `LOG_ERROR` | `undefined` - if set, the collection will tell you when an error occures (stops the process)
>
> `onRestartBehaviour` - Tells the collection, how it should behave when the db gets restarted (on process start, default: `undefined`)
>
> - `OVERWRITE` - If set, the db will be reseted on restart
> - `undefined`
