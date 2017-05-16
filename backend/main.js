process.on('unhandledRejection', r => console.log(r))

const Datastore = require('nedb')
const config = require('../config')
const Server = require('./Server')
const Person = require('../Models/Person')
const Device = require('../Models/Device')

const { app, server } = new Server({ port: config.applicationPort, serverMode: 'dev' })
const UI = require('./Ui')(server)
const UIEvents = require('../Events/UIEvents')

const db = {}
db.persons = {}
db.devices = []
db.people = new Datastore({ filename: './stores/people.db', autoload: true })
/* Set Autocompaction Interval to 5m */
db.people.persistence.setAutocompactionInterval(1000 * 60 * 5)

/* function onHostDiscovery(host) {
  UI.emit(UIEvents.deviceDiscovered, UI.all(), host)
}*/

/* function onHostDisappearance(host) {
  UI.emit(UIEvents.deviceDisappeared, UI.all(), host)
}*/

function onDeviceUpdate(person) {
  UI.emit(UIEvents.deviceUpdateNotification, UI.all(), person)
}

function onPersonDisappearance(person) {
  UI.emit(UIEvents.notifyPersonOffline, UI.all(), person)
}

function onPersonAppearance(person) {
  UI.emit(UIEvents.notifyPersonOnline, UI.all(), person)
}

function onPersonUpdate(person) {
  db.persons[person.email] = person
  UI.emit(UIEvents.personUpdateNotification, UI.all(), person)
}

function createPerson(person) {
  db.people.findOne({ email: person.email }, async (err, result) => {
    if (result == null) {
      await person.updateAvatars()
      db.people.insert(person)

      UI.emit(UIEvents.people, UI.all(), [person])
      UI.emit(UIEvents.addPersonNotification, UI.all(), person)
      loadPersons()
    }
  })
}

function setOwnerOfDevice(target, email, mac) {
  function setNewOwner(email, mac) {
    db.people.findOne({ email }, (err, person) => {
      if (person != null) {
        if (!person.devices) {
          person.devices = []
        }
        person.devices.push({ mac })
        db.people.update({ email }, person)
        onPersonUpdate(person)
        loadPersons()
      }
    })
  }

  db.people.findOne({ 'devices.mac': mac }, (err, person) => {
    if (person) {
      person.devices = person.devices.filter(dev => dev.mac != mac)

      db.people.update({ email: person.email }, { $set: { devices: person.devices } }, (err, replaced) => {
        setNewOwner(email, mac)
      })
    } else {
      setNewOwner(email, mac)
    }
  })
}

function personForDevice(device) {
  return new Promise((resolve) => {
    db.people.findOne({ 'devices.mac': device.mac }, (err, person) => {
      if (person) {
        const personInstance = new Person(person)
        personInstance.devices.push(device)
        resolve(personInstance)
      } else {
        resolve(null)
      }
    })
  })
}

async function personsForDeviceList(devices) {
  // Fetch a person for every device
  const promises = devices.map(personForDevice)
  let persons = await Promise.all(promises)

  // Remove undefined
  persons = persons.filter(p => p)

  // Group devices by persons
  const personGroup = {}
  persons.forEach((person) => {
    if (!personGroup[person.email]) {
      personGroup[person.email] = person
    } else {
      personGroup[person.email].devices.push(person.devices[0])
    }
  })

  return Object.values(personGroup)
}

let previousPersons = []
app.post('/api/devices', async (req, res) => {
  res.send({})
  const devices = req.body

  // hack for hostnames
  devices.forEach((d) => {
    const hostname = d.hostnames ? d.hostnames[0] : ''
    d.hostname = hostname
  })

  db.devices = devices

  const onlinePersons = await personsForDeviceList(devices)
  onlinePersons.forEach(person => onPersonUpdate(person))

  const newPersons = onlinePersons.filter(p => !previousPersons.find(pp => pp.email === p.email))
  const offlinePersons = previousPersons.filter(p => !onlinePersons.find(pp => pp.email === p.email))

  newPersons.forEach(async (person) => {
    onPersonAppearance(person)
  })

  offlinePersons.forEach(async (person) => {
    onPersonDisappearance(person)
  })

  previousPersons = onlinePersons
})

app.get('/api/persons', async (req, res) => {
  const persons = await loadPersons()
  res.send(persons)
})

app.put('/api/person', (req, res) => {
  const person = new Person(req.body)
  createPerson(person)
})

app.get('/api/devices', async (req, res) => {
  console.log(db.devices)
  const devices = await Promise.all(db.devices.map(async (device) => {
    const newDevice = new Device(device)
    const person = await personForDevice(device)
    newDevice.owner = person
    return newDevice
  }))
  res.send(devices)
})

function findPersons(query) {
  return new Promise((resolve, reject) => {
    db.people.find(query, (err, persons) => {
      if (err) {
        reject(err)
      } else {
        resolve(persons)
      }
    })
  })
}

async function updateRandomAvatar() {
  const persons = await findPersons({})
  const randomIndex = Math.floor(Math.random() * persons.length)
  const person = new Person(persons[randomIndex])

  await person.updateAvatars()
  db.people.update({ email: person.email }, person)
}

function loadPersons() {
  return new Promise(async (resolve) => {
    const persons = await findPersons({})
    persons.map(person => new Person(person))
        .forEach((person) => {
          // Merge current devices into new persons
          if (db.persons[person.email]) {
            person.devices = db.persons[person.email].devices
          }
          // Refresh person
          db.persons[person.email] = person
        })
    resolve(Object.values(db.persons))
  })
}

function cron() {
  updateRandomAvatar()
  setTimeout(cron, 5 * 60 * 1000) // Every 5 minutes
}

cron()

UI.on(UIEvents.setOwnerOfDevice, setOwnerOfDevice)
