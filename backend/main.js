

const config = require('../config')
const moment = require('moment')
const Datastore = require('nedb')
const gravatar = require('gravatar')
const UI = require('./Ui')({ port: config.applicationPort, serverMode: 'dev' })
const _ = require('lodash')
const UIEvents = require('../Events/UIEvents')

const db = {}
db.hosts = new Datastore()
db.people = new Datastore({ filename: './stores/people.db', autoload: true })

/* Set Autocompaction Interval to 5m */
db.people.persistence.setAutocompactionInterval(1000 * 60 * 5)

/* garbage.hosts.on(GarbageEvents.delete, (host) => {
  onHostDisappearance(host)
})

events.on(ScannerEvents.host, (host) => {
  handleHost(host)
})
*/

function onHostDiscovery(host) {
  UI.emit(UIEvents.deviceDiscovered, UI.all(), host)
}

function onHostDisappearance(host) {
  UI.emit(UIEvents.deviceDisappeared, UI.all(), host)
}

function onPersonUpdate(person) {
  UI.emit(UIEvents.personUpdateNotification, UI.all(), person)
}

function onDeviceUpdate(person) {
  UI.emit(UIEvents.deviceUpdateNotification, UI.all(), person)
}

function onPersonDisappearance(host) {
  UI.emit(UIEvents.personDisappeared, UI.all(), host)
}

function createPerson(target, person) {
  db.people.findOne({ email: person.email }, (err, result) => {
    if (result == null) {
      person.gravatar = gravatar.url(person.email, { s: '256', r: 'x', d: 'mm' })
      db.people.insert(person)

      UI.emit(UIEvents.people, target, [person])
      UI.emit(UIEvents.addPersonNotification, UI.all(), person)
    }
  })
}

function getPersons(target) {
  db.people.find({}, (err, result) => {
    if (err == null) {
      UI.emit(UIEvents.persons, target, result)
    } else {
      console.log('Error: ', err)
    }
  })
}

function getDevices(target) {
  db.hosts.find({}, (err, result) => {
    if (err == null) {
      UI.emit(UIEvents.devices, target, result)
    } else {
      console.log('Error: ', err)
    }
  })
}

function setOwnerOfDevice(target, email, mac) {
  function updateDevice(mac, person) {
    db.hosts.update({ mac }, { $set: { owner: person } }, {}, (err, num) => {
      console.log('Update: ', num)
      db.hosts.findOne({ mac }, (err, dev) => {
        dev ? onDeviceUpdate(dev) : false
      })
    })
  }

  function setNewOwner(email, mac) {
    if (!email || email == '') {
      updateDevice(mac, null)
      return
    }

    db.people.findOne({ email }, (err, person) => {
      if (person != null) {
        if (!person.devices) {
          person.devices = []
        }
        person.devices.push({ mac })
        db.people.update({ email }, person)
        onPersonUpdate(person)
      }
      updateDevice(mac, person)
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

function handleHost(host) {
  db.hosts.findOne({ mac: host.mac }, (err, entry) => {
    db.people.findOne({ 'devices.mac': host.mac }, (err, person) => {
      if (person) {
        host.owner = person

        db.people.update(
					{ email: person.email },
          {
            $set: {
              lastSeen: host.lastSeen,
					  },
          })
        person.lastSeen = host.lastSeen
        onPersonUpdate(person)
      }

      if (entry) {
        host = _.merge(entry, host)
        db.hosts.update({ mac: host.mac }, host)
      } else {
        db.hosts.insert(host)
      }
      onHostDiscovery(host)
    })
  })
}

function detectPersonsGoingOffline() {
  const detectQuery = { lastSeen: { $lt: offlineThreshold() }, online: true }

  db.people.find(detectQuery, (err, persons) => {
    persons.forEach((person) => {
      UI.emit(UIEvents.notifyPersonOffline, UI.all(), person)
    })
    db.people.update(detectQuery, { $set: { online: false } })
  })
}

function detectPersonsComingOnline() {
  const detectQuery = { lastSeen: { $gt: offlineThreshold() }, online: { $ne: true } }
  db.people.find(detectQuery, (err, persons) => {
    persons.forEach((person) => {
      if (!person.online) {
        UI.emit(UIEvents.notifyPersonOnline, UI.all(), person)
      }
    })
    db.people.update(detectQuery, { $set: { online: true } })
  })
}

function offlineThreshold() {
  return parseInt(moment().format('x')) - (config.offlineAfter * 1000)
}

function isPersonOffline(person) {
  return person.lastSeen < offlineThreshold()
}

function cronJob() {
  detectPersonsComingOnline()
  detectPersonsGoingOffline()
  setTimeout(cronJob, 2500) /* 2.5 s*/
}

cronJob()

UI.on(UIEvents.createPerson, createPerson)
UI.on(UIEvents.getPersons, getPersons)
UI.on(UIEvents.getDevices, getDevices)
UI.on(UIEvents.setOwnerOfDevice, setOwnerOfDevice)
