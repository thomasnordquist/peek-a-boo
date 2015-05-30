var React = require('react');
var moment = require('moment');
var TableRow = require('./TableRow');

var PersonTable = React.createClass({
    sortPersonsByStatus: function(persons, keys){
        return keys.sort(function(keyA, keyB) {
            var a = persons[keyA], b = persons[keyB];
            if(!a.lastSeen) {
                return 1;
            } else if(!b.lastSeen) {
                return -1;
            }
            return Math.round((b.lastSeen-a.lastSeen)/1000/60);
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
    renderPerson: function(key){
        var person = this.props.persons[key];
        return <TableRow key={person.email} person={person} />
    },
    render: function() {

        /* sort lastSeen desc, name asc */
        var sortedPersonKeys = this.sortPersonsByName(this.props.persons, Object.keys(this.props.persons));
        sortedPersonKeys = this.sortPersonsByStatus(this.props.persons, sortedPersonKeys);

        return <table className='table table-striped persons'>
            <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th className='lastSeen'>Last seen</th>
                    <th className='status'>Status</th>
                </tr>
            </thead>
            <tbody>
                { sortedPersonKeys.map(this.renderPerson) }
            </tbody>

        </table>;
    }
});
module.exports = PersonTable;
