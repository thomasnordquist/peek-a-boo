const React = require('react')
const Panel = require('./Layout/Panel')
const io = require('socket.io-client')
const UIEvents = require('../Events/UIEvents')
require('array.prototype.find')

const DeviceList = React.createClass({
  devices: {},
  persons: {},
  getInitialState() {
    this.registerEvents()

    return { devices: this.devices, persons: this.persons }
  },
  registerEvents() {
    this.props.events.on(UIEvents.deviceDiscovered, this.addDevice)
    this.props.events.on(UIEvents.deviceDisappeared, this.removeDevice)
    this.props.events.on(UIEvents.personUpdateNotification, this.updatePerson)
    this.props.events.on(UIEvents.deviceUpdateNotification, this.updateDevice)
    this.props.events.on(UIEvents.persons, this.setPersons)
    this.props.events.on(UIEvents.devices, this.setDevices)
  },
  updatePerson(person) {
    console.log('UpdatePerson: ', person)
    this.persons[person.email] = person
    this.refresh()
  },
  updateDevice(device) {
    console.log('UpdateDevice: ', device)
    this.devices[device.mac] = device
    this.refresh()
  },
  componentWillMount() {
    this.props.events.emit(UIEvents.getPersons)
    this.props.events.emit(UIEvents.getDevices)
  },
  setPersons(persons) {
    persons.forEach((person) => {
      this.persons[person.email] = person
    })
    this.refresh()
  },
  refresh() {
    if (this.isMounted()) {
      this.setState({ persons: this.persons, devices: this.devices })
    }
  },
  setDevices(devices) {
    devices.forEach((device) => {
      this.devices[device.mac] = device
    })
    this.refresh()
  },
  removeDevice(device) {
    if (this.devices[device.mac]) {
      delete this.devices[device.mac]
    }

    if (this.isMounted()) {
      this.setState({ devices: this.devices })
    }
  },
  addDevice(device) {
    this.devices[device.mac] = device

    if (this.isMounted()) {
      this.setState({ devices: this.devices })
    }
  },
  setOwnerForDevice(device, event) {
    const email = event.target.value
    this.props.events.emit(UIEvents.setOwnerOfDevice, email, device.mac)
  },
  render() {
    function isPersonOwner(person, device) {
      return (device.owner && person.email == device.owner.email)
    }
    function selectOwner(device) {
      return (<select onChange={this.setOwnerForDevice.bind(this, device)} defaultValue={device.owner ? device.owner.email : ''}>
        <option value=""> - </option>
        {Object.keys(this.state.persons).map((key) => {
          const person = this.state.persons[key]
          return <option key={person.email} value={person.email}> {person.name}</option>
        })}
      </select>)
    }
    const renderDevices = function (key) {
      const device = this.state.devices[key]
      return (<tr key={device.mac}>
        <td className="hostColumn">{ device.host }</td>
        <td className="macColumn">{ device.mac }</td>
        <td>{selectOwner.call(this, device)}</td>
      </tr>)
    }
    return (
      <Panel title="Devices">
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="hostColumn">Host</th>
              <th className="macColumn">MAC</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            { Object.keys(this.state.devices).map(renderDevices.bind(this)) }
          </tbody>
        </table>
      </Panel>
    )
  },
})
module.exports = DeviceList
