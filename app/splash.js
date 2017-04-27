const startDate = new Date()
const splashTime = 1 * 600
function splash() {
  function show() {
    const e = document.getElementById('splash')
    e.className = 'loaded'
    setTimeout(() => e.style.display = 'none', 750)
  }

  const shouldBeVisibleInMilliseconds = (startDate.getTime() + splashTime) - (new Date()).getTime()
  if (shouldBeVisibleInMilliseconds > 0) {
    setTimeout(show, shouldBeVisibleInMilliseconds)
  } else {
    show()
  }
}

window.unsplash = splash

module.exports = splash
