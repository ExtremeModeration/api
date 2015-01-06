/**
 * Created by steve on 1/4/15.
 */

module.exports = function(superagent, expect, auth, tearDown) {
    describe('/v1/secure/users tests', function(){
        var user_id;
        
        it('create a user', function(done){
            superagent.post('http://localhost:3000/v1/secure/user')
                .set('x-access-token', auth.token)
                .set('x-key', auth.user.username)
                .send({
                    username: 'extrememoderationx',
                    name: 'ExtremeModerationX',
                    email: 'extrememoderationtvx@gmail.com'
                })
                .end(function(e, result){
                    expect(e).to.eql(null);
                    expect(typeof result.body).to.eql('object');
                    expect(result.body._id.length).to.eql(24);
                    user_id = result.body._id;
                    expect(result.body.username).to.eql('extrememoderationx');
                    expect(result.body.name).to.eql('ExtremeModerationX');
                    expect(result.body.email).to.eql('extrememoderationtvx@gmail.com');
                    done();
                });
        });
        
        it('get a user by id', function(done){
            superagent.get('http://localhost:3000/v1/secure/user/'+user_id)
                .set('x-access-token', auth.token)
                .set('x-key', auth.user.username)
                .end(function(e, result){
                    expect(e).to.eql(null);
                    expect(typeof result.body).to.eql('object');
                    expect(result.body._id).to.eql(user_id);
                    expect(result.body.username).to.eql('extrememoderationx');
                    done();
                });
        });
        
        it('list users', function(done){
            superagent.get('http://localhost:3000/v1/secure/users')
                .set('x-access-token', auth.token)
                .set('x-key', auth.user.username)
                .end(function(e, result){
                    expect(e).to.eql(null);
                    expect(typeof result.body).to.eql('object');
                    expect(result.body.length).to.be.above(0);
                    done();
                });
        });
        
        it('update user', function(done){
            superagent.put('http://localhost:3000/v1/secure/user/' + user_id)
                .set('x-access-token', auth.token)
                .set('x-key', auth.user.username)
                .send({
                    _id: user_id,
                    username: 'extrememoderationx',
                    name: 'ExtremeModerationXYZ',
                    email: 'now-this-is-my-email@gmail.com'
                })
                .end(function(e, result){
                    expect(e).to.eql(null);
                    expect(typeof result.body).to.eql('object');
                    expect(result.body.message).to.eql('success');
                    done();
                });
        });

        it('verify user was updated', function(done){
            superagent.get('http://localhost:3000/v1/secure/user/'+user_id)
                .set('x-access-token', auth.token)
                .set('x-key', auth.user.username)
                .end(function(e, result){
                    expect(e).to.eql(null);
                    expect(typeof result.body).to.eql('object');
                    expect(result.body._id).to.eql(user_id);
                    expect(result.body.username).to.eql('extrememoderationx');
                    expect(result.body.name).to.eql('ExtremeModerationXYZ');
                    expect(result.body.email).to.eql('now-this-is-my-email@gmail.com');
                    done();
                });
        });
        
        it('delete the user', function(done){
            superagent.del('http://localhost:3000/v1/secure/user/'+user_id)
                .set('x-access-token', auth.token)
                .set('x-key', auth.user.username)
                .end(function(e, result){
                    expect(e).to.eql(null);
                    expect(typeof result.body).to.eql('object');
                    expect(result.body.message).to.eql('success');
                    done();
                });
        });

        it('finishing users tests', function(done){
            done();
            tearDown('blog');
        });
    });
};
