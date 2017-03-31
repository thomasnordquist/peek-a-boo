const React = require('react')

const Panel = React.createClass({
  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <span className="title">
            {this.props.title}
          </span>
          <span className="controls">
            {this.props.controls ? this.props.controls : null}
          </span>
        </div>
        <div className="panel-body">
          {this.props.children}
        </div>
      </div>
    )
  },
})
module.exports = Panel

