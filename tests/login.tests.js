module.exports = function(superagent, expect, authComplete) {
	describe('/login tests', function() {
		it('login and get token', function(done){
			superagent.post('http://localhost:3000/login')
				.send({
					username: 'extrememoderation',
					password: 'yeah-this-is-not-really-my-password'
				})
				.end(function(e, res){
					expect(e).to.eql(null);
					expect(typeof res.body).to.eql('object');
					expect(res.body.token.length).to.be.above(0);
					done();

					authComplete(res.body); // the login test is complete, pass auth to the handler so other tests can run.
				});
		});
	});
};