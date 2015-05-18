var React = require("react");
var Link = require("react-router").Link;

require('bootstrap/js/collapse');

var Application = React.createClass({
	render: function() {
		return ( 
			<nav className="navbar navbar-default">
				<div className="container-fluid">
					<div className="navbar-header">
						<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<a className="logo navbar-brand" href="#">Peek-A-Boo</a>
					</div>
					<div id="navbar" className="navbar-collapse collapse" ref="collapse">
						<ul className="nav-items nav navbar-nav" id="navbar">
							<li><Link className='nav-item persons' to='people'>Persons</Link></li>
							<li><Link className='nav-item devices' to='devices'>Devices</Link></li>
						</ul>
					</div>
				</div>
			</nav>
		);
	}
});
module.exports = Application;
