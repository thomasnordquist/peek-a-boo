/*
 * All time parameters are expected in seconds
 */

const env = process ? process.env : {}

module.exports = {
  applicationPort: env.PORT ? env.PORT : '', /* the application will be served here (also possible to bind to host: 127.0.0.1:8080)*/
  bindToHost: null, /* enter an ip to bind the application port to a specific ip */
  offlineAfter: 60, /* 1 minute */
  dev: env.DEV ? true : false,
}
