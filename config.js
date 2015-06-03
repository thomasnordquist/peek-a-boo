/*
 * All time parameters are expected in seconds
 */

 module.exports = {
	 applicationPort: '8000', /* the application will be served here (also possible to bind to host: 127.0.0.1:8080)*/
	 offlineAfter: 60*50, /* 5 minutes */
	 nmapBinary: '/usr/bin/nmap',
	 bindToHost: null, /* enter an ip to bind the application port to a specific ip */
	 nmapRange: '192.168.178.1-255',
	 discoverInterval: 2,
	 discoveryUrl: 'http://localhost:8080', /* url where the discover updates come from */
	 discoverPort: 8080 /* discover server pushes information on this port */
};
