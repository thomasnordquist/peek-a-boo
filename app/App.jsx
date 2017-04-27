require('./Styles/style.less')
require('./index.html')

const React = require('react')
const { Component } = require('react')
const Navigation = require('./Layout/Navigation')
const RouteHandler = require('react-router').RouteHandler
const io = require('socket.io-client')
const UIEvents = require('../Events/UIEvents')
const notify = require('./Notify.jsx')
const { url } = require('./Api')

const events = io.connect(url)

events.on(UIEvents.notifyPersonOnline, (person) => {
  notify(person.name, { image: person.gravatar, body: 'is now at the office' })
})

events.on(UIEvents.notifyPersonOffline, (person) => {
  notify(person.name, { image: person.gravatar, body: 'just left the office' })
})

class Application extends Component {
  render() {
    return (
      <div>
        <Navigation />
        <div className="container-fluid">
          <RouteHandler events={events} />
        </div>
      </div>
    )
  }
}

module.exports = Application
