const React = require('react')
const ReactDOM = require('react-dom')
const Router = require('react-router')

const App = require('./App')
const Devices = require('./Devices')
const Persons = require('./Persons')

const Route = Router.Route
const DefaultRoute = Router.DefaultRoute

// polyfill
if (!Object.assign) { Object.assign = React.__spread }

const routes = (
  <Route name="app" handler={App} path="/">
    <DefaultRoute handler={Persons} />
    <Route name="people" handler={Persons} />
    <Route name="devices" handler={Devices} />
  </Route>
)

// Or, if you'd like to use the HTML5 history API for cleaner URLs:

Router.run(routes, Router.HistoryLocation, (Handler) => {
  ReactDOM.render(<Handler />, document.getElementById('content'))
})
