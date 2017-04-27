const React = require('react')
const { Component } = require('react')
const notify = require('./Notify')

class NotificationSettings extends Component {
  static notificationsAvailable() {
    return ('Notification' in window)
  }

  static notificationsEnabled() {
    return (Notification.permission === 'granted')
  }

  static disablePermissions() {
    notify('Revoke permissions by clicking on the icon on th left side in your address bar', { timeout: 5000 })
  }

  static disableNotificationButton() {
    return (<button
      onClick={NotificationSettings.disablePermissions}
      className="notificationSettings"
    >
      Disable
    </button>)
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  requestPermissions() {
    const self = this
    Notification.requestPermission((permission) => {
      if (permission === 'granted') {
        notify('Notifications enabled')
        self.setState({ enabled: true })
      }
    })
  }

  render() {
    if (!NotificationSettings.notificationsAvailable()) {
      return null
    } else if (!NotificationSettings.notificationsEnabled()) {
      return (<button href="#" onClick={this.requestPermissions} className="notificationSettings">
        Notify Me
      </button>)
    }
    return NotificationSettings.disableNotificationButton()
  }
}

module.exports = NotificationSettings
