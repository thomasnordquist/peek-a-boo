const React = require('react')
const { PropTypes } = require('react')
const Person = require('../../Models/Person')
const moment = require('moment')
const StatusBadge = require('../StatusBadge')

function PersonLine(props) {
  const person = props.person

  return (
    <tr className="person" key={person.email}>
      <td><img alt={person.name} src={person.getAvatar()} className="gravatar" /></td>
      <td className={person.isOffline() ? 'statusOffline' : 'statusOnline'}>{ person.name }</td>
      <td className="lastSeen">{ person.lastSeen() ? moment().to(person.lastSeen()) : '-' }</td>
      <td className="status">
        <StatusBadge person={person} />
      </td>
    </tr>
  )
}

PersonLine.propTypes = {
  person: PropTypes.instanceOf(Person).isRequired,
}
module.exports = PersonLine
