var React = require('react');
var Panel = require('./Layout/Panel');
var io = require('socket.io-client');
var UIEvents = require('../Events/UIEvents');


var DeviceList = React.createClass({
    devices: {},
    getInitialState: function(){
        this.props.events.on(UIEvents.deviceDiscovered, this.addDevice);
        this.props.events.on(UIEvents.deviceDisappeared, this.removeDevice);
        return {devices: this.devices};
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
        console.log(device);
        this.devices[device.mac] = device;

        if(this.isMounted()){
            this.setState({devices: this.devices});
        }
    },
    render: function() {
        var renderDevices = function(key){
            var device = this.state.devices[key];
            return <tr key={device.mac}>
                <td>{ device.ip }</td>
                <td>{ device.mac }</td>
                <td>{ device.host }</td>
            </tr>
        };
        return (
            <Panel title='Devices'>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>IP</th>
                            <th>MAC</th>
                            <th>Hostname</th>
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
