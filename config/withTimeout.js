module.exports = function (fn, timeout, callback) {
  let timedOut = false
  const to = setTimeout(() => {
    timedOut = true
    callback()
  }, timeout)
  fn(() => {
    clearTimeout(to)
    if (!timedOut) callback()
  })
}
