var mongoskin = require('mongoskin');

var mongo = {
	url: function() {
		var mongourl;
		if(process.env.VCAP_SERVICES){
		   //app is running in cloud foundry
		   var svcs = JSON.parse(process.env.VCAP_SERVICES);
		   mongourl = svcs['mongolab'][0].credentials.uri;
		}
		else{
		   //running locally or not on cloud foundry
		   mongourl = (process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/extrememoderation');
		}
		return mongourl;
	},

	db: function() {
		return mongoskin.db(mongo.url(), {safe: true});
	}
};

module.exports = mongo;
