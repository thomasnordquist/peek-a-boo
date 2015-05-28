/*
 * All time parameters are expected in seconds
 */

 module.exports = {
	 offlineAfter: 60*5, /* 5 minutes */
	 nmapBinary: '/usr/bin/nmap',
	 nmapRange: '192.168.178.1-255',
	 discoverInterval: 2,
	 discoverPort: 8080 /* discover server pushes information on this port */
};
