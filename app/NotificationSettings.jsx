var React = require('react');
var notify = require('Notify');
var NotificationSettings = React.createClass({
    getInitialState: function(){
        return {};
    },
    notificationsAvailable: function() {
        return ("Notification" in window);
    },
    notificationsEnabled: function() {
        return (Notification.permission === "granted");
    },
    requestPermissions: function() {
        var self = this;
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                notify("Notifications enabled");
                self.setState({enabled: true});
            }
        });
    },
    disablePermissions: function() {
        notify('Revoke permissions by clicking on the icon in your address bar', {timeout: 5000});
    },
    render: function() {
        if( !this.notificationsAvailable() ) {
            return null;
        } else if( !this.notificationsEnabled() ) {
            return <a onClick={this.requestPermissions} className='notificationSettings'>Notify Me</a>;
        } else {
            return <a onClick={this.disablePermissions} className='notificationSettings'>Disable</a>;
        }
    }
});
module.exports = NotificationSettings;
