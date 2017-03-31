module.exports = class Device {
  constructor({ hostnames, mac, lastSeen, ip }) {
    const hosts = hostnames || []

    this.hostname = hosts[0]
    this.mac = mac
    this.lastSeen = lastSeen
    this.ip = ip
  }
}
