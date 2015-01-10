/**
 * Created by steve on 1/2/15.
 */
var jwt = require('jwt-simple');

var auth = function(db) {
    
    var collection = db.collection('users');
    
    function genToken(user) {
        var expires = expiresIn(7); // 7 days
        var token = jwt.encode({
            exp: expires
        }, require('../config/secret.js')());
        
        return {
            token: token,
            expires: expires,
            user: user
        };
    }

    function expiresIn(numDays) {
        var dateObj = new Date();
        return dateObj.setDate(dateObj.getDate() + numDays);
    }

    var _auth = {
        login: function(req, res, next) {
            var username = req.body.username || '',
                password = req.body.password || '';
            
            if (username == '' || password == '') {
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "Invalid credentials"
                });
                return;
            }
            
            _auth.validate(username, password, function(e, dbUserObj){
                if (e) return next(e);
                if (!dbUserObj) {
                    res.status(401);
                    res.json({
                        "status": 401,
                        "message": "Invalid credentials"
                    });
                    return;
                } else {
                    res.json(genToken(dbUserObj));
                }
            });
        },
        
        validate: function(username, password, done) {
            collection.findOne({username: username}, function(e, result){
                done(e, result);
            });
        },

        validateUser: function(username, done) {
            collection.findOne({username: username}, function(e, result){
                done(e, result);
            });
        }
    };

    return _auth;
};

module.exports = auth;
