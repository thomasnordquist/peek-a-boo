const React = require('react')
const Person = require('../../Models/Person')
const config = require('../../config')
const moment = require('moment')

class PersonLine extends React.Component {
  static isOnline(person) {
    return ((moment().format('x') - person.lastSeen()) / 1000) > config.offlineAfter
  }

  static isOffline(person) {
    return (!person.lastSeen() || PersonLine.isOnline(person))
  }

  render() {
    const person = this.props.person

    return (
      <tr className="person" key={person.email}>
        <td><img alt={person.name} src={person.getAvatar()} className="gravatar" /></td>
        <td className={PersonLine.isOffline.call(this, person) ? 'statusOffline' : 'statusOnline'}>{ person.name }</td>
        <td className="lastSeen">{ person.lastSeen() ? moment().to(person.lastSeen()) : 'never' }</td>
        <td className="status">
          { PersonLine.isOffline.call(this, person)
            ? <label className="offline">offline</label>
            : <label className="online">online</label>
          }
        </td>
      </tr>
    )
  }
}

PersonLine.propTypes = {
  person: React.PropTypes.instanceOf(Person).isRequired,
}
module.exports = PersonLine
