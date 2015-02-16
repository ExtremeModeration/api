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
                user = req.body;
            
            if (username == '') {
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "Invalid credentials"
                });
                return;
            }

            if (user._id !== undefined) delete user._id;

            collection.findOne({username: username},function(e, _user){
                if (e) return next(e);
                if (!_user) {
                    // insert
                    collection.insert(user, function(e, result){
                        if (e) return next(e);
                        res.send(genToken(result[0]));
                    });
                } else {
                    // update
                    collection.updateById(_user._id, {$set: user}, {safe: true, multi: false}, function(e, result){
                        if (e) return next(e);
                        user._id = _user._id;
                        res.send(genToken(user));
                    });
                }
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
