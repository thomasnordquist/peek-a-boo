var defaultImage = require('./Styles/statics/see-no-evil.png');

module.exports = function Notify(text, opt) {
    function canNotify() {
        return ("Notification" in window) && (Notification.permission === "granted");
    }

    if(!opt)
        opt = {};

    var timeout = opt.timeout || 2000;
    var image = opt.image || defaultImage;
    var body = opt.body || '';

    console.log(defaultImage);

    if(canNotify()) {
        var notification = new Notification(text, {icon: image, body: body});
        setTimeout(function() { notification.close()}, timeout);
    }
};