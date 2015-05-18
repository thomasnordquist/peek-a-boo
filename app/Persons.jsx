var React = require('react');
var Panel = require('./Layout/Panel');
var PersonForm = require('./PersonForm');
var io = require('socket.io-client');
var UIEvents = require('../Events/UIEvents');
var config = require('../config');
var moment = require('moment');

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
    isOnline: function(person){
        return ((moment().format('x')-person.lastSeen) / 1000) > config.offlineAfter;
    },
    sortPersonsByStatus: function(persons, keys){
        return keys.sort(function(keyA, keyB) {
            var a = persons[keyA], b = persons[keyB];
            return Math.round((b.lastSeen-a.lastSeen) / 1000 / 60);
        }.bind(this));
    },
    sortPersonsByName: function(persons, keys){
        return keys.sort(function(keyA, keyB) {
            var a = persons[keyA], b = persons[keyB];
            if ( a.name < b.name )
                return -1;
            if ( a.name > b.name )
                return 1;
            return 0;
        }.bind(this));
    },
    render: function() {
        var isOffline = function(person) {
            return (!person.lastSeen || this.isOnline(person));
        };
        var renderPersons = function(key){
            var person = this.state.persons[key];
            return (
                <tr key={person.email + Math.random()} className='person'>
                    <td><img className='gravatar' src={ person.gravatar } /></td>
                    <td className={isOffline.call(this, person) ? 'statusOffline' : 'statusOnline'}>{ person.name }</td>
                    <td className='lastSeen'>{ person.lastSeen ? moment().to(person.lastSeen) : 'never' }</td>
                    <td className='status'>{ isOffline.call(this, person) ? <label className='offline'>offline</label> : <label className='online'>online</label> }</td>
                </tr>
            );
        };
        var sortedPersonKeys = this.sortPersonsByName(this.state.persons, Object.keys(this.state.persons));
        sortedPersonKeys = this.sortPersonsByStatus(this.state.persons, sortedPersonKeys);

        console.log(sortedPersonKeys);
        return (
            <Panel title='Persons'>
                <table className='table table-striped persons'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th className='lastSeen'>Last seen</th>
                            <th className='status'>Status</th>
                        </tr>
                    </thead>
                    <tbody>

                        { sortedPersonKeys.map(renderPersons.bind(this)) }
                    </tbody>

                </table>
                {!this.state.personForm ? <a onClick={this.createPersonForm}>Add Person</a> : null}
                {this.state.personForm}
            </Panel>
        );
    }
});
module.exports = Persons;
