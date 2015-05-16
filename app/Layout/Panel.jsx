var React = require('react');

var Panel = React.createClass({
    render: function() {
        return (
            <div className='panel panel-default'>
                <div className='panel-heading'>
                    <span className='title'>
                        {this.props.title}
                    </span>
                </div>
                <div className='panel-body'>
                    {this.props.children}
                </div>
            </div>
        );
    }
});
module.exports = Panel;


