var slugify = require('slugify');

var blogs = function(db) {
	var collection = db.collection('blog');
	collection.ensureIndex([['slug', 1]], true, function(err, replies){});

	function handle_res(e, result, res, next) {
		if (e) return next(e);
		res.send(result);
	};

	function handle_put_delete_res(e, result, res, next) {
		if (e) return next(e);
		res.send({message: result === 1 ? 'success' : 'error'});
	};

	return {
		list: function(req, res, next) {
			collection.find({}, {limit: 10, sort: [['datePublished', -1]]}).toArray(function(e, result){
				handle_res(e, result, res, next);
			});
		},

		getOne: function(req, res, next) {
			var id = req.params.id;
			collection.findById(id, function(e, result) {
				handle_res(e, result, res, next);
			});
		},

		withSlug: function(req, res, next) {
			var slug = req.params.slug;
			collection.findOne({slug: slug}, function(e, result) {
				handle_res(e, result, res, next);
			});
		},

		create: function(req, res, next) {
			req.body.slug = slugify(req.body.title.toLowerCase());
			collection.insert(req.body, {}, function(e, result) {
				handle_res(e, result[0], res, next);
			});
		},

		update: function(req, res, next) {
			var id = req.params.id;
			req.body.slug = slugify(req.body.title.toLowerCase());
			if (req.body._id !== undefined) delete req.body._id;
			collection.updateById(id, {$set:req.body}, {safe: true, multi: false}, function(e, result) {
				handle_put_delete_res(e, result, res, next);
			});
		},

		delete: function(req, res, next) {
			var id = req.params.id;
			collection.removeById(id, function(e, result) {
				handle_put_delete_res(e, result, res, next);
			});
		}
	};
};

module.exports = blogs;
