var server = require('./server.js')
	superagent = require('superagent'),
	expect = require('expect.js');

function authComplete(auth) {
	var test_files = [
		'blog', 'forum'
	]

	for (var i=0; i < test_files.length; i++) {
		require('./tests/' + test_files[i] + '.tests.js')(superagent, expect, auth);
	}
}

require('./tests/login.tests.js')(superagent, expect, authComplete);
