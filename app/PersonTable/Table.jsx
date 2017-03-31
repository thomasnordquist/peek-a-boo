const React = require('react')
const moment = require('moment')
const TableRow = require('./TableRow')

const PersonTable = React.createClass({
  sortPersonsByStatus(persons, keys) {
    return keys.sort((keyA, keyB) => {
      let a = persons[keyA],
        b = persons[keyB]
      if (!a.lastSeen) {
        return 1
      } else if (!b.lastSeen) {
        return -1
      }
      return Math.round((b.lastSeen - a.lastSeen) / 1000 / 60)
    })
  },
  sortPersonsByName(persons, keys) {
    return keys.sort((keyA, keyB) => {
      let a = persons[keyA],
        b = persons[keyB]
      if (a.name < b.name) { return -1 }
      if (a.name > b.name) { return 1 }
      return 0
    })
  },
  renderPerson(key) {
    const person = this.props.persons[key]
    return <TableRow key={person.email} person={person} />
  },
  render() {
        /* sort lastSeen desc, name asc */
    let sortedPersonKeys = this.sortPersonsByName(this.props.persons, Object.keys(this.props.persons))
    sortedPersonKeys = this.sortPersonsByStatus(this.props.persons, sortedPersonKeys)

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
        { sortedPersonKeys.map(this.renderPerson) }
      </tbody>

    </table>)
  },
})
module.exports = PersonTable
