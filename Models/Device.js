const config = require('../config')
const moment = require('moment')

module.exports = class Device {
  constructor({ hostname, mac, vendor, lastSeen, ip, owner }) {
    this.hostname = hostname
    this.mac = mac
    this.vendor = vendor
    this.lastSeen = lastSeen
    this.ip = ip
    this.owner = owner
  }

  isOnline() {
    return moment(this.lastSeen()) > moment().subtract(config.offlineAfter, 'seconds')
  }
}
