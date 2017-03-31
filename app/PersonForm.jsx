const React = require('react')
const Person = require('../Models/Person')

class PersonForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { email: '', name: '', github: '' }
  }

  addPerson() {
    if (this.state.email === '' || this.state.name === '' || this.state.github === '') {
      alert('Enter valid values')
    } else {
      const person = new Person(this.state)
      this.props.onAddPerson(person)
    }
  }

  render() {
    return (
      <div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            placeholder="Gravatar"
            onKeyUp={event => this.setState({ email: event.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Github">Github</label>
          <input
            type="text"
            className="form-control"
            id="github"
            placeholder="Github"
            onKeyUp={event => this.setState({ github: event.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Name"
            onKeyUp={event => this.setState({ name: event.target.value })}
          />
        </div>
        <button
          onClick={() => this.props.onAbort()}
          className="btn btn-danger btn-sm"
        >Abort</button>&nbsp;
        <button
          onClick={() => this.addPerson()}
          type="submit"
          className="btn btn-primary btn-sm"
        >Add</button>
      </div>
    )
  }
}

PersonForm.propTypes = {
  onAddPerson: React.PropTypes.func.isRequired,
}

module.exports = PersonForm
