const _ = require('lodash')
const util = require('util')
const EventEmitter = require('events').EventEmitter
const ScannerEvents = require('../Events/Scanner')
const libnmap = require('node-libnmap')
const arp = require('node-arp')
const moment = require('moment')
const config = require('../config.js')

const opts = {
  nmap: config.nmapBinary,
  range: [config.nmapRange],
}

function Scanner() {
  const self = this

  EventEmitter.call(this)

  const discoverInterval = config.discoverInterval * 1000
  let discoverTimeout = null

  function discover() {
    libnmap.nmap('discover', _.clone(opts), (err, report) => {
      if (err) { console.log('Error', err) }
			// console.log(report);
      report[0].neighbors.forEach((result) => {
				// result = result[0];
        console.log('Found: ', result)
        handleNmapResult(result)
      })
      discoverTimeout = setTimeout(discover, discoverInterval)
    })
  }

  function handleNmapResult(result) {
    function reportHost(mac) {
      const info = {
        mac,
        host: result,
        lastSeen: parseInt(moment().format('x')),
      }
      console.log('Resolved: ', result, mac)
      self.emit(ScannerEvents.host, info)
    }
    const time = Math.round(Math.random() * 2)
    setTimeout(fetchMac, time, result, reportHost)
  }

  function fetchMac(host, callback) {
    arp.getMAC(host, (err, mac) => {
      if (!err) {
        callback(mac)
      }
    })
  }

  this.stop = function () {
    clearTimeout(discoverTimeout)
  }

  this.start = function () {
    discover()
  }
}

util.inherits(Scanner, EventEmitter)

module.exports = Scanner
