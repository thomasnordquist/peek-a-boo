var React = require("react");
var Navigation = require('./Layout/Navigation');
var RouteHandler = require("react-router").RouteHandler;

require('./Styles/style.less');
var io = require('socket.io-client');
var events = io.connect(window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: ''));

var Application = React.createClass({
    render: function() {
        return (
            <div>
                <Navigation />
                <div className="container-fluid">
                    <RouteHandler events={events} />
                </div>
            </div>
        );
    }
});
module.exports = Application;
