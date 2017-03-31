const React = require('react')

class PersonForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { email: '', name: '' }
  }

  addPerson() {
    if (this.state.email === '' || this.state.name === '') {
      alert('Enter valid values')
    } else {
      this.props.onAddPerson(this.state.email, this.state.name)
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
            onChange={value => this.setState({ name: value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Name"
            onChange={value => this.setState({ name: value })}
          />
        </div>
        <button
          onClick={this.props.onAbort}
          className="btn btn-danger btn-sm"
        >Abort</button>&nbsp;
        <button
          onClick={this.addPerson}
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
