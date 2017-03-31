module.exports = class Device {
  constructor({ hostnames, mac, ip }) {
    const hosts = hostnames || []

    this.hostname = hosts[0]
    this.mac = mac
    this.ip = ip
  }
}
