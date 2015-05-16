var React = require('react');

var PersonForm = React.createClass({
    addPerson: function() {
        var email = React.findDOMNode(this.refs.email).value;
        var name = React.findDOMNode(this.refs.name).value;
        if(email == '' || name  == '') {
            alert('Enter valid values');
        } else {
            this.props.onAddPerson(email, name);
        }
    },
    render: function() {
        return (
            <div>
                <div className='form-group'>
                    <label htmlFor='exampleInputEmail1'>Email address</label>
                    <input ref='email' type='email' className='form-control' id='exampleInputEmail1' placeholder='Gravatar' />
                </div>
                <div className='form-group'>
                    <label htmlFor='exampleInputPassword1'>Name</label>
                    <input ref='name' type='text' className='form-control' id='name' placeholder='Name' />
                </div>
                <button onClick={this.props.onAbort} className='btn btn-danger btn-sm'>Abort</button>&nbsp;
                <button onClick={this.addPerson} type='submit' className='btn btn-primary btn-sm'>Add</button>
            </div>
        );
    }
});
module.exports = PersonForm;
