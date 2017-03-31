module.exports = function loadersByExtension(obj) {
  const loaders = []
  const extensions = Object.keys(obj).map(key => key.split('|')).reduce((arr, a) => {
    arr.push(...a)
    return arr
  }, [])
  Object.keys(obj).forEach((key) => {
    const exts = key.split('|')
    const value = obj[key]
    const entry = {
      extensions: exts,
      test: extsToRegExp(exts),
      loaders: value,
    }
    if (Array.isArray(value)) {
      entry.loaders = value
    } else if (typeof value === 'string') {
      entry.loader = value
    } else {
      Object.keys(value).forEach((key) => {
        entry[key] = value[key]
      })
    }
    loaders.push(entry)
  })
  return loaders
}

function extsToRegExp(exts) {
  return new RegExp(`\\.(${exts.map(ext => `${ext.replace(/\./g, '\\.')}(\\?.*)?`).join('|')})$`)
}
