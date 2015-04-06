module.exports = function(db) {
    
    var viewers = db.collection('viewers');
    
    return {
        updateViewers: function(req, res, next) {
            var viewerList = req.body.viewers;
            var savedViewers = [];
            var i = 0;

            function saveViewer(viewerName) {
                viewers.findOne({name: viewerName}, function(e, record){
                    if (e) return next(e);
                    
                    if (record) {
                        record.points++;
                        var _id = record._id;
                        delete record._id;
                        viewers.updateById(_id, record, function(e, result){
                            if (e) return next(e);
                            saveCallback(viewerName);
                        });
                    } else {
                        viewers.insert({name: viewerName, points: 1}, function(e, result){
                            if (e) return next(e);
                            saveCallback(viewerName);
                        });
                    }
                    
                });
            }
            
            function saveCallback(viewerName) {
                savedViewers.push(viewerName);
                i++;
                if (i >= viewerList.length) {
                    res.send({message: 'saved ' + savedViewers.length + ' viewers', viewers: savedViewers});
                } else {
                    saveViewer(viewerList[i]);
                }
            }
            
            saveViewer(viewerList[i]);
        },
        
        getViewerPoints: function(req, res, next) {
            viewers.findOne({name: req.params.name}, function(e, viewer){
                if (e) return next(e);
                if (viewer) {
                    res.send(viewer);
                } else {
                    res.send({
                        name: req.params.name,
                        points: 0
                    });
                }
            });
        }
    }
}