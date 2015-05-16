var React = require('react');
var Panel = require('./Layout/Panel');
var PersonForm = require('./PersonForm');
var io = require('socket.io-client');
var UIEvents = require('../Events/UIEvents');
var config = require('../config');
var moment = require('moment');
require('moment-duration-format');


var Persons = React.createClass({
    persons: {},
    getInitialState: function(){
        this.props.events.on(UIEvents.personDiscovered, this.addPerson);
        this.props.events.on(UIEvents.personDisappeared, this.removePerson);
        this.props.events.on(UIEvents.persons, this.setPersons);
        return {persons: this.persons, personForm: null};
    },
    componentDidMount: function(){
        this.props.events.emit(UIEvents.getPersons);
    },
    setPersons: function(persons) {
        console.log(persons);
        this.persons = persons;
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
        console.log(person);
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
        return this.props.events.emit(UIEvents.createPerson, {email: email, name: name});
    },
    render: function() {
        var isOffline = function(person) {
            return (!person.lastSeen || ((moment().format('x')-person.lastSeen) / 1000) > config.offlineAfter);
        };
        var renderPersons = function(key){
            var person = this.state.persons[key];
            return (
                <tr key={person.email}>
                    <td><img className='gravatar' src={ person.gravatar } /></td>
                    <td>{ person.name }</td>
                    <td>{ person.lastSeen ? moment().diff(person.lastSeen).duration.format() : '' }</td>
                    <td>{ isOffline(person) ? 'offline' : 'online' }</td>
                </tr>
            );
        };
        return (
            <Panel title='Hosts'>
                <table className='table table-striped table-hover'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Last seen</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>

                        { Object.keys(this.state.persons).map(renderPersons.bind(this)) }
                    </tbody>

                </table>
                {!this.state.personForm ? <a onClick={this.createPersonForm}>Add Person</a> : null}
                {this.state.personForm}
            </Panel>
        );
    }
});
module.exports = Persons;
