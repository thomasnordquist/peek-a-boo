const Person = require('../Models/Person')
const React = require('react')
const Panel = require('./Layout/Panel')
const PersonForm = require('./PersonForm')
const UIEvents = require('../Events/UIEvents')
const NotificationSettings = require('./NotificationSettings')
const PersonTable = require('./PersonTable/Table')
const Api = require('./Api')

class Persons extends React.Component {
  constructor(props) {
    super(props)
    this.persons = {}
    this.state = { persons: this.persons, personForm: null }
  }

  componentDidMount() {
    Api.getPersons().then(persons => this.setPersons(persons))
    this.registerEvents()
  }

  componentWillUnmount() {
    console.log('will unmount')
    this.unregisterEvents()
  }

  setPersons(persons) {
    persons.forEach((person) => {
      this.persons[person.email] = new Person(person)
    })
    this.refresh()
  }

  registerEvents() {
    this.personUpdateEventHandler = person => this.updatePerson(person)
    this.addPersonEventHandler = person => this.addPerson(person)

    this.props.events.on(UIEvents.personUpdateNotification, this.personUpdateEventHandler)
    this.props.events.on(UIEvents.addPersonNotification, this.addPersonEventHandler)
  }

  unregisterEvents() {
    this.props.events.on(UIEvents.personUpdateNotification, this.personUpdateEventHandler)
    this.props.events.on(UIEvents.addPersonNotification, this.addPersonEventHandler)
  }

  updatePerson(person) {
    this.persons[person.email] = new Person(person)
    this.refresh()
  }

  addPerson(person) {
    this.persons[person.email] = new Person(person)
    this.refresh()
  }

  abortPersonCreation() {
    return this.setState({ personForm: null })
  }

  createPerson(person) {
    Api.createPerson(person)
    this.setState({ personForm: null })
  }

  createPersonForm() {
    return this.setState({
      personForm: <PersonForm
        onAbort={() => this.abortPersonCreation()}
        onAddPerson={(email, name) => this.createPerson(email, name)}
      />,
    })
  }

  refresh() {
    this.setState({ persons: this.persons })
  }

  removePerson(person) {
    if (this.persons[person.email]) {
      delete this.persons[person.email]
    }

    this.refresh()
  }

  render() {
    return (
      <Panel title="Persons" controls={<NotificationSettings />}>
        <PersonTable persons={this.state.persons} />
        {!this.state.personForm ? <button onClick={() => this.createPersonForm()}>Add Person</button> : null}
        {this.state.personForm}
      </Panel>
    )
  }
}

Persons.propTypes = {
  events: React.PropTypes.object.isRequired,
}
module.exports = Persons
