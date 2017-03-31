const moment = require('moment')

module.exports = class Person {
  constructor({ email, name, gravatar, devices }) {
    this.email = email
    this.name = name
    this.gravatar = gravatar || ''
    this.devices = devices || []
  }

  lastSeen() {
    const lastSeenDevice = this.devices.sort(
      (a, b) => {
        const dateA = a.lastSeen ? moment(a.lastSeen) : 0
        const dateB = b.lastSeen ? moment(b.lastSeen) : 0
        return dateA < dateB
      })[0]

    if (lastSeenDevice) {
      return lastSeenDevice.lastSeen
    }
    return null
  }
}
