var server = require('./server.js'),
	superagent = require('superagent'),
	expect = require('expect.js'),
	db = require('./server/config/mongodb.js').db();

function authComplete(auth) {
	var test_files = ['blog', 'forum', 'users'],
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
		require('./tests/' + test_files[i] + '.tests.js')(superagent, expect, auth, tearDown);
	}
}

require('./tests/login.tests.js')(superagent, expect, db, authComplete);
