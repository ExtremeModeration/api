var slugify = require('slugify');
module.exports = function(superagent, expect, db, authComplete) {
	describe('/login tests', function() {
		var username, _id;
		
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
				_id = result[0]._id.toString();
				done();
			})
		});
		
		it('login and get token', function(done){
			superagent.post('http://localhost:3000/login')
				.send({
					username: username,
					password: 'yeah-this-is-not-really-my-password'
				})
				.end(function(e, res){
					expect(e).to.eql(null);
					expect(typeof res.body).to.eql('object');
					expect(res.body.token.length).to.be.above(0);
					res.body.user._id = _id;
					done();
					
					authComplete(res.body); // the login test is complete, pass auth to the handler so other tests can run.
				});
		});
	});
};
