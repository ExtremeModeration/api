module.exports = function(port, superagent, expect, auth, tearDown) {
	describe('/v1/forum(s) tests', function(){
		var forum_id, forum_slug,
			thread_id, thread_slug,
			message_id;

		var forum = {
			name: 'Some forum name',
			slug: 'some-forum-name',
			thread_count: 15,
			recent_thread: {
				name: 'Recent Thread Yo',
				slug: 'recent-thread-yo',
				updated_at: '2015-03-03 12:00:00.00',
				author: 'ExtremeModeration'
			}
		};

		it('create a forum', function(done){
			superagent.post('http://localhost:' + port +'/v1/forum')
				.set('x-access-token', auth.token)
				.set('x-key', auth.user.username)
				.send({ name: 'Automated test forum' })
				.end(function(e, result) {
					expect(e).to.eql(null);
					expect(result.body).to.be.an('object');
					expect(result.body._id.length).to.eql(24);
					expect(result.body.thread_count).to.eql(0);
					expect(result.body.recent_thread).to.eql(null);
					
					forum_id = result.body._id;
					expect(result.body.slug).to.eql('automated-test-forum');
					forum_slug = result.body.slug;
					done();
				});
		});

		it('get list of forums', function(done){
			superagent.get('http://localhost:' + port +'/v1/forums')
				.end(function(e, result){
					expect(e).to.eql(null);
					expect(result.body).to.be.an('object');
					expect(result.body.length).to.be.above(0);
					done();
				});
		});

		it('should update the forum\'s name', function(done){
			superagent.put('http://localhost:' + port + '/v1/forum/' + forum_id)
				.set('x-access-token', auth.token)
				.set('x-key', auth.user.username)
				.send({
					name: 'Automated test forum X'
				})
				.end(function(e, result){
					expect(e).to.eql(null);
					expect(result.status).to.eql(200);
					expect(result.body).to.be.an('object');
					expect(result.body.name).to.eql('Automated test forum X');
					expect(result.body.slug).to.eql('automated-test-forum-x');
					
					forum_slug = result.body.slug;
					
					done();
				});
		});

		it('create thread in forum', function(done){
			superagent.post('http://localhost:' + port +'/v1/forum/'+forum_id)
				.set('x-access-token', auth.token)
				.set('x-key', auth.user.username)
				.send({
					name: 'Automated test thread',
					message: {
						body: 'This is the first message in the thread',
						dateCreate: new Date()
					}
				})
				.end(function(e, result){
					expect(e).to.eql(null);
					expect(typeof result.body).to.eql('object');
					expect(result.body._id.length).to.eql(24);
					thread_id = result.body._id;
					expect(result.body.slug).to.eql('automated-test-thread');
					thread_slug = result.body.slug;
					done();
				});
		});
		
		it('should get the forum with a single thread in the count and recent_thread', function(done){
			superagent.get('http://localhost:' + port + '/v1/forum/' + forum_id)
				.end(function(e, result){
					expect(e).to.eql(null);
					expect(result.body).to.be.an('object');
					expect(result.body.thread_count).to.eql(1);
					expect(result.body.recent_thread).to.be.an('object');
					expect(result.body.recent_thread.author.username).to.eql(auth.user.username);
					expect(result.body.recent_thread.slug).to.eql(thread_slug);
					
					done();
				});
		});
		
		it('should get the forum by its slug', function(done){
			superagent.get('http://localhost:' + port + '/v1/forum/with-slug/' + forum_slug)
				.end(function(e, result){
					expect(e).to.eql(null);
					expect(result.status).to.eql(200);
					expect(result.body).to.be.an('object');
					expect(result.body.slug).to.eql(forum_slug);
					expect(result.body._id).to.eql(forum_id);
					
					done();
				});
		});

		it('get the list of threads in the forum', function(done){
			superagent.get('http://localhost:' + port +'/v1/forum/'+forum_id+'/threads')
				.end(function(e, result){
					expect(e).to.eql(null);
					expect(result.body).to.be.an('object');
					expect(result.body).to.have.keys(['threads', 'name', 'slug']);
					expect(result.body.threads).to.be.an('array');
					expect(result.body.threads.length).to.eql(1);
					done();
				});
		});
		
		it('get the list of threads in the forum by slug', function(done){
			superagent.get('http://localhost:' + port +'/v1/forum/with-slug/'+forum_slug+'/threads')
				.end(function(e, result){
					expect(e).to.eql(null);
					expect(result.body).to.be.an('object');
					expect(result.body).to.have.keys(['threads', 'name', 'slug']);
					expect(result.body.threads).to.be.an('array');
					expect(result.body.threads.length).to.eql(1);
					done();
				});
		});

		it('get thread', function(done){
			superagent.get('http://localhost:' + port +'/v1/forum/'+forum_id+'/thread/'+thread_id)
				.end(function(err, result){
					expect(err).to.eql(null);
					expect(typeof result.body).to.eql('object');
					expect(result.body.messages.length).to.be.above(0);
					done();
				});
		});

		it('get thread by slug', function(done){
			superagent.get('http://localhost:' + port +'/v1/forum/with-slug/'+forum_slug+'/thread/'+thread_slug)
				.end(function(err, result){
					expect(err).to.eql(null);
					expect(typeof result.body).to.eql('object');
					expect(result.body.messages.length).to.be.above(0);
					done();
				});
		});

		it('create message in thread', function(done){
			superagent.post('http://localhost:' + port +'/v1/forum/'+forum_id+'/thread/'+thread_id)
				.set('x-access-token', auth.token)
				.set('x-key', auth.user.username)
				.send({
					body: 'This is some text generated by the automated testing...',
					dateCreated: new Date()
				})
				.end(function(e, result){
					expect(e).to.eql(null);
					expect(typeof result.body).to.eql('object');
					expect(result.body._id.length).to.eql(24);
					message_id = result.body._id;
					done();
				});
		});

		it ('delete thread', function(done){
			superagent.del('http://localhost:' + port +'/v1/forum/'+forum_id+'/thread/'+thread_id)
				.set('x-access-token', auth.token)
				.set('x-key', auth.user.username)
				.end(function(e, result) {
					expect(e).to.eql(null);
					expect(typeof result.body).to.eql('object');
					expect(result.body.message).to.eql('success');

					done();
				});
		});

		it('test that thread was deleted', function(done){
			superagent.get('http://localhost:' + port +'/v1/forum/'+forum_id+'/thread/'+thread_id)
				.end(function(err, result){
					expect(err).to.eql(null);
					expect(result.status).to.eql(404);
					expect(typeof result.body).to.eql('object');
					expect(result.body.message.toLowerCase()).to.eql('thread not found');
					done();
				});
		});

		it('delete the forum', function(done) {
			superagent.del('http://localhost:' + port +'/v1/forum/'+forum_id)
				.set('x-access-token', auth.token)
				.set('x-key', auth.user.username)
				.end(function(e, result) {
					expect(e).to.eql(null);
					expect(typeof result.body).to.eql('object');
					expect(result.body.message).to.eql('success');

					done();
				});
		});

		it('test that forum was deleted', function(done){
			superagent.get('http://localhost:' + port +'/v1/forum/'+forum_id)
				.end(function(e, result) {
					expect(e).to.eql(null);
					expect(result.status).to.eql(404);
					expect(typeof result.body).to.eql('object');
					expect(result.body.message.toLowerCase()).to.eql('forum not found');
					done();
				})
		});

		it('finishing forum tests', function(done){
			done();
			tearDown('blog');
		});
	});
};
