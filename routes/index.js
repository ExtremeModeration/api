/**
 * Created by steve on 1/2/15.
 */

module.exports = function(db) {
	var express = require('express'),
	router = express.Router(),
	auth = require('./auth.js')(db),
	blogs = require('./blogs.js')(db),
	forums = require('./forums.js')(db),
	page = require('./page.js')(db),
	user = require('./users.js')(db),
	viewers = require('./viewers')(db);

	router.get('/', page.index);
	router.get('/twitch_login', page.twitch_login);
	
	router.post('/login', auth.login);

	router.get('/v1/blogs', blogs.list);
	router.get('/v1/blog/:id', blogs.getOne);
	router.get('/v1/blog/with-slug/:slug', blogs.withSlug);
	router.post('/v1/blog', blogs.create);
	router.put('/v1/blog/:id', blogs.update);
	router.delete('/v1/blog/:id', blogs.delete);

	router.get('/v1/forums', forums.listForums);
	router.get('/v1/forum/:forum_id', forums.getForum);
	router.get('/v1/forum/with-slug/:slug', forums.getForumWithSlug);
	router.put('/v1/forum/:forum_id', forums.updateForum);
	router.post('/v1/forum', forums.createForum);
	router.post('/v1/forum/:forum_id', forums.createThread);
	router.get('/v1/forum/:forum_id/threads', forums.listThreads);
	router.get('/v1/forum/with-slug/:slug/threads', forums.listThreadsWithSlug);
	router.post('/v1/forum/:forum_id/thread/:thread_id', forums.createMessage);
	router.get('/v1/forum/:forum_id/thread/:thread_id', forums.getThread);
	router.get('/v1/forum/with-slug/:forum_slug/thread/:thread_slug', forums.getThreadWithSlug);
	router.delete('/v1/forum/:forum_id/thread/:thread_id', forums.deleteThread);
	router.delete('/v1/forum/:forum_id', forums.deleteForum);

	router.get('/v1/secure/users', user.list);
	router.get('/v1/secure/user/:id', user.getById);
	router.post('/v1/secure/user', user.create);
	router.put('/v1/secure/user/:id', user.update);
	router.delete('/v1/secure/user/:id', user.delete);
	
	router.put('/v1/viewers', viewers.updateViewers);
	router.get('/v1/viewers/:name', viewers.getViewerPoints);

	return router;
};
