/**
 * Created by steve on 1/10/15.
 */

module.exports = function(db) {
    var collection = db.collection('user');
    return {
        create: function(user_data, done, next) {
            collection.findOne({username: user_data.username}, function(e, result){
                if (e) return next(e);
                if (!result) {
                    collection.insert(user_data, function(er, user){
                        if (er) return next(er);
                        done(user);
                    });
                }
            });
        }
    }
};
