var React = require('react');
var Panel = require('./Layout/Panel');
var PersonForm = require('./PersonForm');
var io = require('socket.io-client');
var UIEvents = require('../Events/UIEvents');
var config = require('../config');
var NotificationSettings = require('./NotificationSettings');
var PersonTable = require('./PersonTable/Table');

var Persons = React.createClass({
    persons: {},
    getInitialState: function(){
        this.props.events.on(UIEvents.personUpdateNotification, this.updatePerson);
        this.props.events.on(UIEvents.persons, this.setPersons);
        this.props.events.on(UIEvents.addPersonNotification, this.addPerson);
        return {persons: this.persons, personForm: null};
    },
    updatePerson: function(person) {
        this.persons[person.email] = person;
        this.refresh();
    },
    componentDidMount: function(){
        this.props.events.emit(UIEvents.getPersons);
    },
    setPersons: function(persons) {
        persons.forEach(function(person){
            this.persons[person.email] = person;
        }.bind(this));
        this.refresh();
    },
    refresh: function() {
        if(this.isMounted()){
            this.setState({persons: this.persons});
        }
    },
    removePerson: function(person) {
        if(this.persons[person.email]) {
            delete this.persons[person.email];
        }

        this.refresh();
    },
    addPerson: function(person) {
        this.persons[person.email] = person;
        this.refresh();
    },
    createPersonForm: function(){
        return this.setState({personForm: <PersonForm onAbort={this.abortPersonCreation} onAddPerson={this.createPerson} />});
    },
    abortPersonCreation: function(){
        return this.setState({personForm: null});
    },
    createPerson: function(email, name){
        this.props.events.emit(UIEvents.createPerson, {email: email, name: name});
        this.setState({personForm: null})
    },
    render: function() {
        return (
            <Panel title='Persons' controls={<NotificationSettings />}>
                <PersonTable persons={this.state.persons} />
                {!this.state.personForm ? <a onClick={this.createPersonForm}>Add Person</a> : null}
                {this.state.personForm}
            </Panel>
        );
    }
});
module.exports = Persons;
