const React = require('react')

class Panel extends React.Component {
  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <span className="title">
            {this.props.title}
          </span>
          <span className="controls">
            {this.props.controls}
          </span>
        </div>
        <div className="panel-body">
          {this.props.children}
        </div>
      </div>
    )
  }
}

Panel.propTypes = {
  title: React.PropTypes.node.isRequired,
  controls: React.PropTypes.node.isOptional,
  children: React.PropTypes.node.isRequired,
}

Panel.defaultProps = {
  controls: null,
}

module.exports = Panel
