require('./Styles/style.less')

const html = require('./index.html')
const React = require('react')
const Navigation = require('./Layout/Navigation')
const RouteHandler = require('react-router').RouteHandler
const io = require('socket.io-client')
const UIEvents = require('../Events/UIEvents')
const notify = require('./Notify.jsx')

const events = io.connect(`${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`)

events.on(UIEvents.notifyPersonOnline, (person) => {
  notify(person.name, { image: person.gravatar, body: 'is now at the office' })
})

events.on(UIEvents.notifyPersonOffline, (person) => {
  notify(person.name, { image: person.gravatar, body: 'just left the office' })
})

const Application = new React.createClass({
  render() {
    return (
      <div>
        <Navigation />
        <div className="container-fluid">
          <RouteHandler events={events} />
        </div>
      </div>
    )
  },
})
module.exports = Application
