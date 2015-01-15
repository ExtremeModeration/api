/**
 * Created by steve on 1/10/15.
 */
module.exports = function(db){
    var twitch = require('../config/twitch.js'),
        superagent = require('superagent'),
        user_service = require('../services/userService.js'),
        user_auth_collection = db.collection('user_auth');
    return {
        index: function(req, res, next) {
            res.render('index', {
                title: 'ExtremeModeration API',
                twitch: twitch
            });
        },
        
        twitch_login: function(req, res, next) {
            var code = req.query.code;
            if (code == undefined) return next();
            
            superagent.post('https://api.twitch.tv/kraken/oauth2/token')
                .type('form')
                .send({
                    client_id: twitch.client.id,
                    client_secret: twitch.client.secret,
                    grant_type: 'authorization_code',
                    redirect_uri: twitch.client.redirect_url,
                    code: code
                })
                .end(function(e, result){
                    if (e) return next(e);
                    
                    superagent.get('https://api.twitch.tv/kraken/user')
                        .set('Accept','application/vnd.twitchtv.v2+json')
                        .set('Authorization', 'OAuth ' + result.access_token)
                        .end(function(er, user){
                            if (er) return next(er);
                            
                            user_auth_collection.remove({username: user.name}, function(re, result){
                                user_auth_collection.insert({username: user.name, access_token: result.access_token}, function(ie, resu){
                                    res.send(user.name);
                                });
                            });
                        });
                });
        }
    }
};
