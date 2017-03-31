/*
 * All time parameters are expected in seconds
 */

 module.exports = {
	 applicationPort: '8087', /* the application will be served here (also possible to bind to host: 127.0.0.1:8080)*/
	 bindToHost: null, /* enter an ip to bind the application port to a specific ip */
	 offlineAfter: 60 * 1, /* 1 minute */
	 nmapBinary: '/usr/local/bin/nmap',
	 nmapRange: '192.168.178.1-255',
	 discoverInterval: 2,
	 discoveryUrl: 'http://localhost:8081', /* url where the discover updates come from */
	 discoverPort: 8081, /* discover server pushes information on this port */
 }
