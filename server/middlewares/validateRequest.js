module.exports = function(db) {

	var jwt = require('jwt-simple'),
	validateUser = require('../routes/auth')(db).validateUser;

	return function(req, res, next) {
		if (req.method == 'GET' && req.url.indexOf('secure') < 0) {
			next();
		} else {
			var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
			var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

			if (token || key) {
				try {
					var decoded = jwt.decode(token, require('../config/secret.js')());

					if (decoded.exp <= Date.now()) {
						res.status(400);
						res.json({
							"status": 400,
							"message": "Token expired"
						});
						return;
					}

					validateUser(key, function(e, dbUser){
						if (e) return next(e);
						
						if (dbUser) {
							req.user = dbUser;
							if ((req.url.indexOf('secure') >= 0 && dbUser.role == 'admin') || (req.url.indexOf('secure') < 0 && req.url.indexOf('/v1/') >= 0)) {
								next();
							} else {
								res.status(403);
								res.json({
									"status": 403,
									"message": "Not Authorized"
								});
								return;
							}
						} else {
							res.status(401);
							res.json({
								"status": 401,
								"message": "Invalid User"
							});
							return;
						}
					});
				} catch(err) {
					res.status(500);
					res.json({
						"status": 500,
						"message": "Oops, something went wrong!",
						"error": err
					});
					return;
				}
			} else {
				res.status(401);
				res.json({
					"status": 401,
					"message": "Invalid token or key"
				});
				return;
			}
		}
	};
}
