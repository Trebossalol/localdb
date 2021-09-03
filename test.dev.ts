import { Database, Collection, Map } from '../localdb/lib/index'

interface User {
  username: string
  coins: number
}

interface Settings {
  test: string;
  bool: boolean;
}

const DefaultSettings: Settings = {
  bool: true, 
  test: ''
};


(async() => {

  const db = new Database('mydb', {
    absolutePath: './db',
    entries: {
      accounts: new Collection<User>('accounts'),
      settings: new Map<Settings>('settings', { template: DefaultSettings })
    }
  })
  
  await db.start();

  await db.access('accounts').update({ username: 'tb' }, {
    $writeConcern: {
      username: 'tb',
      coins: 20
    }
  })

  const current = await db.access('settings').get('bool')

  await db.access('settings').set('bool', !current)

})()