const Datastore = require('nedb')
const config = require('../config')
const Server = require('./Server')
const Person = require('../Models/Person')
const axios = require('axios')

const { app, server } = new Server({ port: config.applicationPort, serverMode: 'dev' })
const UI = require('./Ui')(server)
const UIEvents = require('../Events/UIEvents')

const db = {}
db.hosts = []
db.persons = {}
db.people = new Datastore({ filename: './stores/people.db', autoload: true })

function loadPersons() {
  return new Promise((resolve) => {
    db.people.find({}, (err, persons) => {
      persons
        .map(person => new Person(person))
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
  })
}
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

/* function onPersonDisappearance(host) {
  UI.emit(UIEvents.personDisappeared, UI.all(), host)
}*/

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

function getPersons(target) {
  loadPersons()
    .then((persons) => {
      UI.emit(UIEvents.persons, target, persons)
    })
}

function getDevices(target) {
  UI.emit(UIEvents.devices, target, db.devices)
}

function setOwnerOfDevice(target, email, mac) {
  if (!email || email === '') {
    return
  }
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

const previousDevices = []
app.post('/api/devices', async (req, res) => {
  res.send({})
  const devices = req.body
  db.devices = devices

  const onlinePersons = await personsForDeviceList(devices)
  onlinePersons.forEach(person => onPersonUpdate(person))

  console.log('online', onlinePersons)
  const newDevices = devices.filter(d => !previousDevices.find(pd => pd.mac === d.mac))
  const removedDevices = previousDevices.filter(d => !devices.find(pd => pd.mac === d.mac))
})

app.get('/api/persons', async (req, res) => {
  const persons = await loadPersons()
  res.send(persons)
})

app.put('/api/person', (req, res) => {
  const person = new Person(req.body)
  createPerson(person)
})

app.get('/api/devices', (req, res) => {
  res.send(db.devices)
})

function cron() {
  db.people.find({}, (err, persons) => {
    persons.forEach(async (p) => {
      const person = new Person(p)
      await person.updateAvatars()
      db.people.update({ email: person.email }, person)
    })
  })
  setTimeout(cron, 60 * 1000) // Hourly
}

cron()

UI.on(UIEvents.setOwnerOfDevice, setOwnerOfDevice)
