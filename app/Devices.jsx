var React = require('react');
var Panel = require('./Layout/Panel');
var io = require('socket.io-client');
var UIEvents = require('../Events/UIEvents');
require('array.prototype.find');

var DeviceList = React.createClass({
    devices: {},
    persons: {},
    getInitialState: function(){
        this.registerEvents();

        return {devices: this.devices, persons: this.persons};
    },
    registerEvents: function() {
        this.props.events.on(UIEvents.deviceDiscovered, this.addDevice);
        this.props.events.on(UIEvents.deviceDisappeared, this.removeDevice);
        this.props.events.on(UIEvents.personUpdateNotification, this.updatePerson);
        this.props.events.on(UIEvents.deviceUpdateNotification, this.updateDevice);
        this.props.events.on(UIEvents.persons, this.setPersons);
        this.props.events.on(UIEvents.devices, this.setDevices);
    },
    updatePerson: function(person) {
        console.log('UpdatePerson: ', person);
        this.persons[person.email] = person;
        this.refresh();
    },
    updateDevice: function(device) {
        console.log('UpdateDevice: ', device);
        this.devices[device.mac] = device;
        this.refresh();
    },
    componentWillMount: function(){
        this.props.events.emit(UIEvents.getPersons);
        this.props.events.emit(UIEvents.getDevices);
    },
    setPersons: function(persons) {
        persons.forEach(function(person){
            this.persons[person.email] = person;
        }.bind(this));
        this.refresh();
    },
    refresh: function() {
        if(this.isMounted()){
            this.setState({persons: this.persons, devices: this.devices});
        }
    },
    setDevices: function(devices) {
        devices.forEach(function(device){
            this.devices[device.mac] = device;
        }.bind(this));
        this.refresh();
    },
    removeDevice: function(device) {
        if(this.devices[device.mac]) {
            delete this.devices[device.mac];
        }

        if(this.isMounted()){
            this.setState({devices: this.devices});
        }
    },
    addDevice: function(device) {
        this.devices[device.mac] = device;

        if(this.isMounted()){
            this.setState({devices: this.devices});
        }
    },
    setOwnerForDevice: function(device, event){
        var email = event.target.value;
        this.props.events.emit(UIEvents.setOwnerOfDevice, email, device.mac);
    },
    render: function() {
        function isPersonOwner(person, device){
            return (device.owner && person.email == device.owner.email);
        }
        function selectOwner(device) {
            return <select onChange={this.setOwnerForDevice.bind(this, device)} defaultValue={device.owner ? device.owner.email : ''}>
                <option value=''> - </option>
                {Object.keys(this.state.persons).map(function(key){
                    var person = this.state.persons[key];
                    return <option key={person.email} value={person.email}> {person.name}</option>
                }.bind(this))}
            </select>;
        }
        var renderDevices = function(key){
            var device = this.state.devices[key];
            return <tr key={device.mac}>
                <td>{ device.ip }</td>
                <td className='macColumn'>{ device.mac }</td>
                <td className='hostColumn'>{ device.host }</td>
                <td>{selectOwner.call(this, device)}</td>
            </tr>
        };
        return (
            <Panel title='Devices'>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>IP</th>
                            <th className='macColumn'>MAC</th>
                            <th className='hostColumn'>Hostname</th>
                            <th>Owner</th>
                        </tr>
                    </thead>
                    <tbody>
                        { Object.keys(this.state.devices).map(renderDevices.bind(this)) }
                    </tbody>
                </table>
            </Panel>
        );
    }
});
module.exports = DeviceList;
