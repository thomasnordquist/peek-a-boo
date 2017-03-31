const React = require('react')
const notify = require('./Notify')
const NotificationSettings = React.createClass({
  getInitialState() {
    return {}
  },
  notificationsAvailable() {
    return ('Notification' in window)
  },
  notificationsEnabled() {
    return (Notification.permission === 'granted')
  },
  requestPermissions() {
    const self = this
    Notification.requestPermission((permission) => {
      if (permission === 'granted') {
        notify('Notifications enabled')
        self.setState({ enabled: true })
      }
    })
  },
  disablePermissions() {
    notify('Revoke permissions by clicking on the icon on th left side in your address bar', { timeout: 5000 })
  },
  render() {
    if (!this.notificationsAvailable()) {
      return null
    } else if (!this.notificationsEnabled()) {
      return <a onClick={this.requestPermissions} className="notificationSettings">Notify Me</a>
    }
    return <a onClick={this.disablePermissions} className="notificationSettings">Disable</a>
  },
})
module.exports = NotificationSettings
