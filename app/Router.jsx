var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var App = require("./App");
var Hosts = require("./Hosts");

// polyfill
if(!Object.assign)
    Object.assign = React.__spread;

var routes = (
    <Route name="app" handler={App} path="/">
        <DefaultRoute handler={Hosts} />
        <Route name="hosts" handler={Hosts} />
        <Route name="people" handler={Hosts} />
    </Route>
);

// Or, if you'd like to use the HTML5 history API for cleaner URLs:

Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler />, document.getElementById('content'));
});
