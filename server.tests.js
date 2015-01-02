var superagent = require('superagent'),
	expect = require('expect.js');

describe('api.extrememoderation.tv rest server', function(){
	var auth;
	var blog_id;

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
				auth = res.body;
				done();
			});
	});

	it('create a blog post', function(done){
		superagent.post('http://localhost:3000/v1/blog')
			.send({
				title: 'This is a test blog post',
				body: 'This is a test blog post (body)',
				author: 'ExtremeModeration',
				access_token: auth.token,
				x_key: auth.user.username
			})
			.end(function(e, resp){
				expect(e).to.eql(null);
				expect(typeof res.body).to.eql('object');
				expect(res.body.id.length).to.eql(24);
				blog_id = res.body.id;
				done();
			});
	});

	it('list most recent blog posts', function(done){
		superagent.get('http://localhost:3000/v1/blogs')
			.end(function(e, res){
				expect(e).to.eql(null);
				expect(typeof res.body).to.eql('object');
				expect(res.body.length).to.be.above(0);
				expect(res.body.length).to.be.below(11);
				done();
			});
	});

	it('get blog by id', function(done){
		superagent.get('http://localhost:3000/v1/blog/'+blog_id)
			.end(function(e, res){
				expect(e).to.eql(null);
				expect(typeof res.body).to.eql('object');
				expect(res.body.id.length).to.eql(24);
				expect(res.body.id).to.eql(blog_id);
				done();
			});
	});

	it('update blog', function(done){
		superagent.put('http://localhost:3000/v1/blog/'+blog_id)
			.send({
				title: 'This is a test blog post xxx',
				body: 'This is a test blog post (body) xxx',
				author: 'ExtremeModeration',
				access_token: auth.token,
				x_key: auth.user.username
			})
			.end(function(e, res){
				expect(e).to.eql(null);
				expect(typeof res.body).to.eql('object');
				expect(res.body.title).to.eql('This is a test blog post xxx');
				done();
			});
	});

	it('delete blog', function(done){
		superagent.del('http://localhost:3000/v1/blog/'+blog_id)
			.end(function(e, res){
				expect(e).to.eql(null);
				done();
			});
	});
});