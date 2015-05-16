var React = require('react');
var Panel = require('./Layout/Panel');
var io = require('socket.io-client');
var UIEvents = require('../Events/UIEvents');


var HostList = React.createClass({
    hosts: {},
    getInitialState: function(){
        this.props.events.on(UIEvents.hostDiscovered, this.addHost);
        this.props.events.on(UIEvents.hostDisappeared, this.removeHost);
        return {hosts: []};
    },
    removeHost: function(host) {
        if(this.hosts[host.mac]) {
            delete this.hosts[host.mac];
        }

        if(this.isMounted()){
            this.setState({hosts: this.hosts});
        }
    },
    addHost: function(host) {
        console.log(host);
        this.hosts[host.mac] = host;

        if(this.isMounted()){
            this.setState({hosts: this.hosts});
        }
    },
    render: function() {
        var renderHosts = function(key){
            var host = this.state.hosts[key];
            return <tr key={host.mac}>
                <td>{ host.ip }</td>
                <td>{ host.mac }</td>
                <td>{ host.host }</td>
            </tr>
        };
        return (
            <Panel title='Hosts'>
                <table className='table table-striped'>
                    <tr>
                        <th>IP</th>
                        <th>MAC</th>
                        <th>Host</th>
                    </tr>
                    { Object.keys(this.state.hosts).map(renderHosts.bind(this)) }
                </table>
            </Panel>
        );
    }
});
module.exports = HostList;
