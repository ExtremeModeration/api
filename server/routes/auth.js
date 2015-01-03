/**
 * Created by steve on 1/2/15.
 */
var jwt = require('jwt-simple');

var auth = function(db) {
    
    function genToken(user) {
        var expires = expiresIn(7); // 7 days
        var token = jwt.encode({
            exp: expires
        }, require('../config/secret')());
        
        return {
            token: token,
            expires: expires,
            user: user
        };
    };

    function expiresIn(numDays) {
        var dateObj = new Date();
        return dateObj.setDate(dateObj.getDate() + numDays);
    };

    var _auth = {
        login: function(req, res) {
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
            
            var dbUserObj = _auth.validate(username, password);
            
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
        },
        
        validate: function(username, password) {
            // fake credentials used for testing.
            // This should be replaced before actually going to a server
            var dbUserObj = {
                name: 'ExtremeModeration',
                role: 'admin',
                username: 'extrememoderation'
            };
            
            return dbUserObj;
        },

        validateUser: function(username) {
            // fake credentials used for testing.
            // This should be replaced before actually going to a server
            var dbUserObj = {
                name: 'ExtremeModeration',
                role: 'admin',
                username: 'extrememoderation'
            };

            return dbUserObj;
        }
    };

    return _auth;
};

module.exports = auth;