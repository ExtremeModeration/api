/**
 * Created by steve on 1/2/15.
 */

module.exports = function(db) {
	var express = require('express'),
	router = express.Router(),
	auth = require('./auth.js')(db),
	blogs = require('./blogs.js')(db),
	user = require('./users.js')(db);

	// routes that can be accessed by anyone
	router.post('/login', auth.login);

	// routes that can be accessed only by authenticated users
	router.get('/v1/blogs', blogs.list);
	router.get('/v1/blog/:id', blogs.getOne);
	router.get('/v1/blog/with-slug/:slug', blogs.withSlug);
	router.post('/v1/blog', blogs.create);
	router.put('/v1/blog/:id', blogs.update);
	router.delete('/v1/blog/:id', blogs.delete);

	// routes that can be accessed only by authenticated and authorized users
	router.get('/v1/admin/users', user.getAll);
	router.get('/v1/admin/user/:id', user.getOne);
	router.post('/v1/admin/user', user.create);
	router.put('/v1/admin/user/:id', user.update);
	router.delete('/v1/admin/user/:id', user.delete);

	return router;
};