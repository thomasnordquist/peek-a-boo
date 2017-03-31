const Person = require('../Models/Person')
const React = require('react')
const Panel = require('./Layout/Panel')
const PersonForm = require('./PersonForm')
const io = require('socket.io-client')
const UIEvents = require('../Events/UIEvents')
const config = require('../config')
const NotificationSettings = require('./NotificationSettings')
const PersonTable = require('./PersonTable/Table')

const Persons = React.createClass({
  persons: {},
  getInitialState() {
    this.props.events.on(UIEvents.personUpdateNotification, this.updatePerson)
    this.props.events.on(UIEvents.persons, this.setPersons)
    this.props.events.on(UIEvents.addPersonNotification, this.addPerson)
    return { persons: this.persons, personForm: null }
  },
  updatePerson(person) {
    this.persons[person.email] = new Person(person)
    console.log(this.persons[person.email])
    this.refresh()
  },
  componentDidMount() {
    this.props.events.emit(UIEvents.getPersons)
  },
  setPersons(persons) {
    persons.forEach((person) => {
      this.persons[person.email] = new Person(person)
    })
    this.refresh()
  },
  refresh() {
    if (this.isMounted()) {
      this.setState({ persons: this.persons })
    }
  },
  removePerson(person) {
    if (this.persons[person.email]) {
      delete this.persons[person.email]
    }

    this.refresh()
  },
  addPerson(person) {
    this.persons[person.email] = person
    this.refresh()
  },
  createPersonForm() {
    return this.setState({
      personForm: <PersonForm onAbort={this.abortPersonCreation} onAddPerson={this.createPerson} />,
    })
  },
  abortPersonCreation() {
    return this.setState({ personForm: null })
  },
  createPerson(email, name) {
    this.props.events.emit(UIEvents.createPerson, { email, name })
    this.setState({ personForm: null })
  },
  render() {
    return (
      <Panel title="Persons" controls={<NotificationSettings />}>
        <PersonTable persons={this.state.persons} />
        {!this.state.personForm ? <a onClick={this.createPersonForm}>Add Person</a> : null}
        {this.state.personForm}
      </Panel>
    )
  },
})
module.exports = Persons
