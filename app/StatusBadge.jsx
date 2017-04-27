const React = require('react')
const { Component, PropTypes } = require('react')

function StatusBadge(props) {
  if (props.person.devices.length === 0) {
    return <span className="noDevice">no device</span>
  }
  return props.person.isOnline()
      ? <span className="online">online</span>
      : <span className="offline">offline</span>
}

StatusBadge.propTypes = {
  person: PropTypes.object.isRequired,
}

module.exports = StatusBadge
