var slugify = require('slugify');
module.exports = function(port, superagent, expect, db, authComplete) {
	describe('/login tests', function() {
		var user;

		it('inject a user to use for testing', function(done){
			var collection = db.collection('users');
			username = slugify('test-user-' + (new Date().getTime()));
			collection.insert({
				username: username,
				email: username+'@extrememoderation.tv',
				name: username,
				role: 'admin'
			}, {}, function(e, result){
				expect(e).to.eql(null);
				user = result[0];
				done();
			})
		});

		it('login and get token', function(done){
			superagent.post('http://localhost:' + port +'/login')
				.send(user)
				.end(function(e, res){
					expect(e).to.eql(null);
					expect(typeof res.body).to.eql('object');
					expect(res.body.token.length).to.be.above(0);
					expect(res.body.user.username).to.eql(user.username);
					done();

					authComplete(res.body); // the login test is complete, pass auth to the handler so other tests can run.
				});
		});
	});
};
