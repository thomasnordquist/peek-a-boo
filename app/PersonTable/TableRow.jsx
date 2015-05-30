var React = require('react');
var config = require('../../config');
var moment = require('moment');

var PersonLine = React.createClass({
    componentDidMount: function() {
        React.findDOMNode(this.refs.image).onTouchStart = function(e) {
            e.preventDefault();
        }
    },
    isOnline: function(person){
        return ((moment().format('x')-person.lastSeen) / 1000) > config.offlineAfter;
    },
    render: function() {
        var person = this.props.person;
        var isOffline = function(person) {
            return (!person.lastSeen || this.isOnline(person));
        };

        return (
            <tr className='person'>
                <td><img src={person.gravatar} className='gravatar' ref='image' /></td>
                <td className={isOffline.call(this, person) ? 'statusOffline' : 'statusOnline'}>{ person.name }</td>
                <td className='lastSeen'>{ person.lastSeen ? moment().to(person.lastSeen) : 'never' }</td>
                <td className='status'>{ isOffline.call(this, person) ? <label className='offline'>offline</label> : <label className='online'>online</label> }</td>
            </tr>
        );

    }
});
module.exports = PersonLine;
