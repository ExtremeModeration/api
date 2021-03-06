var server = require('./server.js'),
	superagent = require('superagent'),
	expect = require('expect.js'),
	db = require('./config/mongodb.js').db(),
	port = process.env.PORT || 3000;

function authComplete(auth) {
	var test_files = ['blog', 'forum', 'users', 'viewers'],
		tests_complete = [];

	function tearDown(testName) {
		tests_complete.push(testName);
		if (test_files.length == tests_complete.length) {
			describe('cleaning up after tests complete', function(){
				it('remove the test user', function(done){
					db.collection('users').removeById(auth.user._id, function(e, result){
						expect(e).to.eql(null);
						done();
					});
				});
			});
		}
	}

	for (var i=0; i < test_files.length; i++) {
		require('./tests/' + test_files[i] + '.tests.js')(port, superagent, expect, auth, tearDown);
	}
}

require('./tests/login.tests.js')(port, superagent, expect, db, authComplete);
