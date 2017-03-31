const React = require('react')
const Panel = require('./Layout/Panel')
const Person = require('../Models/Person')
const Device = require('../Models/Device')
const UIEvents = require('../Events/UIEvents')
const Api = require('./Api')

require('array.prototype.find')

class DeviceList extends React.Component {
  constructor(props) {
    super(props)
    this.devices = {}
    this.persons = {}

    this.state = { devices: this.devices, persons: this.persons }
  }

  componentWillMount() {
    this.registerEvents()

    Api.getPersons().then(persons => this.setPersons(persons))
    Api.getDevices().then(devices => this.setDevices(devices))
  }

  componentWillUnmount() {
    this.unregisterEvents()
  }

  setOwnerForDevice(device, email) {
    // const email = event.target.value
    this.props.events.emit(UIEvents.setOwnerOfDevice, email, device.mac)
  }

  setDevices(devices) {
    devices.forEach((device) => {
      this.devices[device.mac] = new Device(device)
    })
    this.refresh()
  }

  setPersons(persons) {
    persons.forEach((person) => {
      this.persons[person.email] = new Person(person)
    })
    this.refresh()
  }

  updatePerson(person) {
    console.log('UpdatePerson: ', person)
    this.persons[person.email] = person
    this.refresh()
  }

  updateDevice(device) {
    console.log('UpdateDevice: ', device)
    this.devices[device.mac] = device
    this.refresh()
  }

  registerEvents() {
    this.deviceDiscoveredEventHandler = res => this.addDevice(res)
    this.deviceDisappearedEventHandler = res => this.removeDevice(res)
    this.personUpdateEventHandler = res => this.updatePerson(res)
    this.deviceUpdateEventHandler = res => this.updateDevice(res)

    this.props.events.on(UIEvents.deviceDiscovered, this.deviceDiscoveredEventHandler)
    this.props.events.on(UIEvents.deviceDisappeared, this.deviceDisappearedEventHandler)
    this.props.events.on(UIEvents.personUpdateNotification, this.personUpdateEventHandler)
    this.props.events.on(UIEvents.deviceUpdateNotification, this.deviceUpdateEventHandler)
  }

  unregisterEvents() {
    this.props.events.removeListener(UIEvents.deviceDiscovered, this.deviceDiscoveredEventHandler)
    this.props.events.removeListener(UIEvents.deviceDisappeared, this.deviceDisappearedEventHandler)
    this.props.events.removeListener(UIEvents.personUpdateNotification, this.personUpdateEventHandler)
    this.props.events.removeListener(UIEvents.deviceUpdateNotification, this.deviceUpdateEventHandler)
  }


  refresh() {
    this.setState({ persons: this.persons, devices: this.devices })
  }

  removeDevice(device) {
    if (this.devices[device.mac]) {
      delete this.devices[device.mac]
    }

    this.setState({ devices: this.devices })
  }

  addDevice(device) {
    this.devices[device.mac] = device
    this.setState({ devices: this.devices })
  }

  renderPersonSelection(device) {
    return (<select onChange={event => this.setOwnerForDevice(device, event.target.value)} defaultValue={device.owner ? device.owner.email : ''}>
      <option value=""> - </option>
      {Object.keys(this.state.persons).map((key) => {
        const person = this.state.persons[key]
        return <option key={person.email} value={person.email}> {person.name}</option>
      })}
    </select>)
  }

  renderDevice(device) {
    return (<tr key={device.mac}>
      <td className="hostColumn">{ device.hostname }</td>
      <td className="macColumn">{ device.mac }</td>
      <td>{this.renderPersonSelection(device)}</td>
    </tr>)
  }

  renderDevices() {
    return Object.values(this.state.devices).map(device => this.renderDevice(device))
  }

  render() {
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
            { this.renderDevices() }
          </tbody>
        </table>
      </Panel>
    )
  }
}

DeviceList.propTypes = {
  events: React.PropTypes.object.isRequired,
}

module.exports = DeviceList
