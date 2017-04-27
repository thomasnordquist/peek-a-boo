const React = require('react')
const { Component, PropTypes } = require('react')
const TableRow = require('./TableRow')
const Person = require('../../Models/Person')
const moment = require('moment')

class PersonTable extends Component {
  static sortPersonsByStatus(a, b) {
    function valueForPersion(p) {
      if (p.devices.length === 0) { return -5 } // should be on the bottom
      return p.isOnline() ? 1 : 0
    }

    const aOnline = valueForPersion(a)
    const bOnline = valueForPersion(b)
    return bOnline - aOnline

    /* const timeA = Math.round(moment(a.lastSeen()).format('x') / 60) // Minutes since 1970
    const timeB = Math.round(moment(b.lastSeen()).format('x') / 60) // Minutes since 1970
    return timeB - timeA*/
  }

  static sortPersonsByName(a, b) {
    return (a.name > b.name) ? 1 : -1
  }

  renderPerson(person) {
    return <TableRow key={person.email} person={person} />
  }

  render() {
    /* sort lastSeen desc, name asc */
    /* let sortedPersonKeys = PersonTable.sortPersonsByName(
      this.props.persons,
      Object.keys(this.props.persons),
    )*/

    // sortedPersonKeys = PersonTable.sortPersonsByStatus(this.props.persons, sortedPersonKeys)

    const persons = Object.values(this.props.persons)
    const a = persons.sort(PersonTable.sortPersonsByName)
    const b = a.sort(PersonTable.sortPersonsByStatus)

    return (<table className="table table-striped persons">
      <thead>
        <tr>
          <th />
          <th>Name</th>
          <th className="lastSeen">Last seen</th>
          <th className="status">Status</th>
        </tr>
      </thead>
      <tbody>
        { b.map(person => this.renderPerson(person)) }
      </tbody>

    </table>)
  }
}

PersonTable.propTypes = {
  persons: PropTypes.arrayOf(PropTypes.instanceOf(Person)).isRequired,
}
module.exports = PersonTable
