const React = require('react')
const config = require('../../config')
const moment = require('moment')

const PersonLine = React.createClass({
  isOnline(person) {
    return ((moment().format('x') - person.lastSeen()) / 1000) > config.offlineAfter
  },
  render() {
    const person = this.props.person
    function isOffline(person) {
      return (!person.lastSeen() || this.isOnline(person))
    }

    return (
      <tr className="person">
        <td><img src={person.gravatar} className="gravatar" /></td>
        <td className={isOffline.call(this, person) ? 'statusOffline' : 'statusOnline'}>{ person.name }</td>
        <td className="lastSeen">{ person.lastSeen() ? moment().to(person.lastSeen()) : 'never' }</td>
        <td className="status">{ isOffline.call(this, person) ? <label className="offline">offline</label> : <label className="online">online</label> }</td>
      </tr>
    )
  },
})
module.exports = PersonLine
