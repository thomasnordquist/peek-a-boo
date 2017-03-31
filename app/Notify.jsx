const defaultImage = require('./Styles/statics/see-no-evil.png')

module.exports = function Notify(text, opt) {
  function canNotify() {
    return ('Notification' in window) && (Notification.permission === 'granted')
  }

  if (!opt) {
    opt = {}
  }

  const timeout = opt.timeout || 2000
  const image = opt.image || defaultImage
  const body = opt.body || ''

  console.log(defaultImage)

  if (canNotify()) {
    const notification = new Notification(text, { icon: image, body })
    setTimeout(() => { notification.close() }, timeout)
  }
}
