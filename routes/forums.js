var slugify = require('slugify'),
	ObjectID = require('mongodb').ObjectID;

module.exports = function(db) {
	var forum_collection = db.collection('forums'),
		thread_collection = db.collection('threads'),
		message_collection = db.collection('messages'),
		user_collection = db.collection('users');

	function handle_res(e, result, res, next) {
		if (e) return next(e);
		res.send(result);
	}

	function handle_put_delete_res(e, result, res, next) {
		if (e) return next(e);
		res.send({message: result === 1 ? 'success' : 'error'});
	}

	return {
		listForums: function(req, res, next) {
			forum_collection.find({}, {sort: [['name', 'ascending']]}).toArray(function(e, result) {
				handle_res(e, result, res, next);
			});
		},

		createForum: function(req, res, next) {
			if (req.body._id) delete req.body._id;
			req.body.slug = slugify(req.body.name.toLowerCase());
			req.body.thread_count = 0;
			req.body.recent_thread = null;
			forum_collection.insert(req.body, {}, function(e, result) {
				handle_res(e, result[0], res, next);
			});
		},

		createThread: function(req, res, next) {
			if (req.body._id) delete req.body._id;
			var forum_id = req.params.forum_id;
			// get the user who's making the request
			user_collection.findOne({username: req.headers['x-key']}, function(e, user){
				if (e) return next(e);
				
				// get the forum that is having the thread created in
				forum_collection.findById(forum_id, function(e, _forum) {
					if (e) return next(e);
					if (_forum) {
						var message = req.body.message;
						delete req.body.message;
						req.body.forum_id = new ObjectID(forum_id);
						req.body.slug = slugify(req.body.name.toLowerCase());
						
						// create the new thread
						thread_collection.insert(req.body, {}, function(er, _thread){
							if (er) return next(er);
							var th = _thread[0];
							message.thread_id = th._id;
							message.author = {
								name: user.name,
								username: user.username
							};
							
							// create the first message in the thread
							message_collection.insert(message, {}, function(err, _message){
								if (err) return next(err);
								_forum.thread_count++;
								_forum.recent_thread = {
									name: th.name,
									slug: th.slug,
									updated_at: new Date(),
									author: message.author
								}
								
								// update the forum info
								var f_id = _forum._id;
								delete _forum._id;
								forum_collection.updateById(f_id, _forum, function(e, result){
									handle_res(err, th, res, next);
								});
							});
						});
					} else {
						res.status(404);
						res.send({
							"status": 404,
							"message": "Forum with id " + forum_id + " not found"
						});
					}
				});
			});
		},

		listThreads: function(req, res, next) {
			var forum_id = req.params.forum_id;
			forum_collection.findById(forum_id, function(e, _forum){
				if (!_forum) {
					res.status(404);
					res.send({
						"status": 404,
						"message": "Forum with id " + forum_id + " not found"
					});
					return next();
				}

				thread_collection.find({forum_id: new ObjectID(forum_id)}, {}).toArray(function(err, result){
					handle_res(err, result, res, next);
				});
			});
		},

		createMessage: function(req, res, next) {
			var forum_id = req.params.forum_id,
				thread_id = req.params.thread_id;

			user_collection.findOne({username: req.headers['x-key']}, function(e, user){
				if (e) return next(e);
				
				thread_collection.findById(thread_id, function(e, _thread) {
					if (!_thread.forum_id == forum_id) {
						res.status(404);
						res.send({
							"status": 404,
							"message": "No thread with id " + thread_id + " is associated with a forum with id " + forum_id
						});
						return next();
					}
	
					if (req.body._id) delete res.body._id;
					req.body.thread_id = new ObjectID(thread_id);
					req.body.author = {
						name: user.name,
						username: user.username
					};
					
					message_collection.insert(req.body, {}, function(err, result){
						var message = result[0];
						forum_collection.findById(forum_id, function(e, forum){
							if (e) return next(e);
							forum.recent_thread = {
								name: _thread.name,
								slug: _thread.slug,
								updated_at: new Date(),
								author: message.author
							}
							delete forum._id;
							
							forum_collection.updateById(forum_id, forum, function(e, result){
								if (e) return next(e);
								handle_res(err, message, res, next);
							});
						});
					});
				});
			});
		},

		deleteThread: function(req, res, next) {
			var forum_id = req.params.forum_id,
				thread_id = req.params.thread_id;

			forum_collection.findById(forum_id, function(err, forum){
				if (!forum) {
					res.status(404);
					res.send({
						"status": 404,
						"message": "Forum Not Found"
					});
					return next();
				}

				thread_collection.findById(thread_id, function(er, thread){
					if (!thread) {
						res.status(404);
						res.send({
							"status": 404,
							"message": "Thread Not Found"
						});
						return next();
					}

					thread_collection.removeById(thread_id, function(e, result) {
						message_collection.remove({thread_id: new ObjectID(thread_id)}, function(error, m_result) {
							handle_put_delete_res(error, result, res, next);
						});
					});
				});
			});
		},

		getThread: function(req, res, next) {
			var forum_id = new ObjectID(req.params.forum_id),
				thread_id = new ObjectID(req.params.thread_id);

			thread_collection.findOne({_id: thread_id, forum_id: forum_id}, function(e, thread){
				if (e) return next(e);

				if (!thread) {
					res.status(404);
					res.send({
						status: 404,
						message: "Thread Not Found"
					});
					return next();
				}

				message_collection.find({thread_id: thread_id}).toArray(function(er, messages){
					thread.messages = messages;
					handle_res(er, thread, res, next);
				});
			});
		},

		deleteForum: function(req, res, next) {
			var forum_id = req.params.forum_id;
			forum_collection.removeById(forum_id, function(e, result) {
				handle_put_delete_res(e, result, res, next);
			});
		},

		getForum: function(req, res, next) {
			var forum_id = req.params.forum_id;
			forum_collection.findById(forum_id, function(e, result){
				if (!result) {
					res.status(404);
					res.send({
						status: 404,
						message: 'Forum Not Found'
					});
					return next();
				}
				
				handle_res(e, result, res, next);
			});
		}
	};
}
