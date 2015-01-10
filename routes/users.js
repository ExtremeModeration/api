var users = function(db) {
	var collection = db.collection ('users');
	collection.ensureIndex([['username', 1]], true, function(err, replies){});
	
	function handle_res(e, result, res, next) {
		if (e) return next(e);
		res.send(result);
	}
	
	function handle_put_delete_res(e, result, res, next) {
		if (e) return next(e);
		res.send({message: result === 1 ? 'success' : 'error'});
	}
	
	return {
		list: function(req, res, next) {
			collection.find({}, {sort: [['username', 1]]}).toArray(function(e, result){
				handle_res(e, result, res, next);
			});
		},

		getById: function(req, res, next) {
			collection.findById(req.params.id, function(e, result){
				handle_res(e, result, res, next);
			});
		},

		create: function(req, res, next) {
			if (req.body._id) delete req.body._id;
			collection.insert(req.body, {}, function(e, result) {
				handle_res(e, result[0], res, next);
			});
		},

		update: function(req, res, next) {
			if (req.body._id) delete req.body._id;
			collection.updateById(req.params.id, {$set: req.body}, {safe: true, multi: false}, function(e, result) {
				handle_put_delete_res(e, result, res, next);
			});
		},

		delete: function(req, res, next) {
			var id = req.params.id;
			collection.findById(id, function(e, user){
				if (e) return next(e);
				if (req.user.username == user.username) {
					res.status(403);
					res.send({
						status: 403,
						message: 'Not authorized to delete yourself (You\'d better check yor self before you wreck yourself, son.)'
					});
					return next();
				}
				
				collection.removeById(id, function(er, result){
					handle_put_delete_res(er, result, res, next);
				});
			});
		}
	};
};

module.exports = users;
