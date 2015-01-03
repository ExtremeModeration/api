var mongoskin = require('mongoskin');

var mongo = {
	url: function() {
		return (process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/extrememoderation');
	},

	db: function() {
		return mongoskin.db(mongo.url(), {safe: true});
	}
};

module.exports = mongo;
