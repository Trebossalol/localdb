# Documentation

First, import the required classes:

```javascript
import { Collection, Database, Map } from '@trebossa/localdb'
```

Define interfaces which represent your collection or map

```typescript
interface User {
  username: string;
}

interface Settings {
  some_bool: boolean
  some_string: string
}
```

# Database

Declaration

```typescript
class Database<Entries extends EntryInterface<Entries>>
```

Create an instance

```typescript
const db = new Database('mydb', {
    absolutePath: './db',
    entries: {
      accounts: new Collection<User>('accounts'),
      settings: new Map<Settings>('settings', { template: DefaultSettings })
    }
  })
```

### Options
> `absolutePath` : `string` - A path to a folder, where all database details should be stored

> `entries` : `EntryInterface<E>` - An object which declares your entries, example:
> ```
  >  {
  >     accounts: new Collection<User>('accounts'),
  >     settings: new Map<Settings>('settings', { template: DefaultSettings })
  >  }
> ```
  
> `collectionConfig` : `CollectionConfig` - Configuration which will be applied to each entry

> `normalize` : `(document) => string` - A callback which will normalize the output json string (default: `(doc) => JSON.stringify(doc, null, 3)`)
  
### Methods
> `async start()` - A method which will initalize the db, if this method isn't called before accessing entries, there will be an error

> `async access<N extends keyof Entries>(name: N)` : A method to access an entry, parameter `name` must be valid name of your entries
  
# Collection
  
Declaration
  
```typescript
class Collection<DocType = DocumentLike>
```

Create a collection

```typescript
const accounts = new Collection('accounts', {
  
})  
```
  
### Options
> `folderPath` : `string` - A path to a folder, where all collection details should be stored (note: This will be automatically specified by your `Database` instance!)

> `normalize` : `(document) => string` - A callback which will normalize the output json string (default: `(doc) => JSON.stringify(doc, null, 3)`)
  
> `docIdGenerator` : `(document) => string` - A callback which must generate a uniqe ID for every document (default: `(_doc) => (Math.random() * (999999 - 111111) + 111111).toString()`)
  
> `fileNameGenerator` : `(collection) => string` - A callback which will generate the filename of the collection (note: This will be automatically specified by your `Database` instance!)
  
> `onErrorBehaviour` : `string` - A string which specifies the behaviour of the collection if an error occues
  >  `CREATE_BACKUP_AND_OVERWRITE`  -> Creates a backup of the error-version and creates a new empty collection
  >   `OVERWRITE`                   -> Overwrites the error-version to an empty collection (Data will be lost!)
  >   `LOG_ERROR`                   -> Throws an exception
  >   `undefined`                   -> `LOG_ERROR`
  
> `onRestartBehaviour` : `string` - A string which specifies the behaviour of the collection on init
  >  `OVERWRITE`                    -> Overwrites the collection (Data will be lost!) 
  >  `undefined`                    -> Normal behaviour 
  
### Methods
  
...
