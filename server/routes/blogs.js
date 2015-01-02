var blogs = {
	list: function(req, res) {
		res.json({});
	},

	getOne: function(req, res) {
		var id = req.params.id;
		res.json({
			id: id
		});
	},

	create: function(req, res) {
		res.json({});
	},

	update: function(req, res) {
		var id = req.params.id;
		res.json({
			id: id
		});
	},

	delete: function(req, res) {
		var id = req.params.id;
		res.json({
			message: 'success'
		});
	}
}

module.exports = blogs;