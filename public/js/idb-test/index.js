import idb from 'idb'

var dbPromise = idb.open('test-db', 3, upgradeDb => {
  switch (upgradeDb.oldVersion) {
    case 0:
      var keyValStore = upgradeDb.createObjectStore('keyval')
      keyValStore.put("world", "hello")
    case 1:
      upgradeDb.createObjectStore('people', { keyPath: 'name' })
    case 2:
      upgradeDb.transaction.objectStore('people').createIndex('age', 'age')
    }
})

// read "hello" in "keyval"
dbPromise
  .then(db => {
    var tx = db.transaction('keyval')
    var keyValStore = tx.objectStore('keyval')
    return keyValStore.get('hello')
  })
  .then(val => console.log('The value of "hello" is:', val))

// set "foo" to be "bar" in "keyval"
dbPromise
  .then(db => {
    var tx = db.transaction('keyval', 'readwrite')
    var keyValStore = tx.objectStore('keyval')
    keyValStore.put('bar', 'foo')
    return tx.complete
  })
  .then(() => console.log('Added foo:bar to keyval'))

dbPromise
  .then(db => {
    const tx = db.transaction('keyval', 'readwrite')
    const keyValStore = tx.objectStore('keyval')
    keyValStore.put('dog', 'favoriteAnimal')
    return tx.complete
  })
  .then(val => console.log('Successfully added favorite animal.'))

dbPromise
  .then(db => {
    const tx = db.transaction('people', 'readwrite')
    const peopleStore = tx.objectStore('people')
    
    peopleStore.put({
      name: 'George Washington',
      age: 286,
      favoriteAnimal: 'eagle'
    })
    peopleStore.put({
      name: 'John Adams',
      age: 282,
      favoriteAnimal: 'dog'
    })
    peopleStore.put({
      name: 'Thomas Jefferson',
      age: 274,
      favoriteAnimal: 'cat'
    })
    peopleStore.put({
      name: 'James Madison',
      age: 266,
      favoriteAnimal: 'dog'
    })

    return tx.complete
  })
    .then(() => console.log('People added successfully.'))
