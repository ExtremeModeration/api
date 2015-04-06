module.exports = function(port, superagent, expect, auth, tearDown) {
    describe('Tests the /v1/viewers endpoint', function(){
        
        it('should add a viewer', function(done){
            superagent.put('http://localhost:' + port +'/v1/viewers')
                .set('x-access-token', auth.token)
                .set('x-key', auth.user.username)
                .send({
                    viewers: ['exmobot']
                })
                .end(function(e, res){
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(200);
                    
                    done();
                });
        });
        
        it('should test getting a viewer\'s points', function(done){
            superagent.get('http://localhost:' + port +'/v1/viewers/exmobot')
                .set('x-access-token', auth.token)
                .set('x-key', auth.user.username)
                .end(function(e, res){
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys(['name','points']);
                    expect(res.body.name.toLowerCase()).to.eql('exmobot');
                    expect(res.body.points).to.be.above(0);
                    
                    done();
                });
        });
        
        it('should tear down the tests', function(done){
            tearDown('viewers');
            done();
        });
        
    });
}