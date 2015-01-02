/**
 * Created by steve on 1/2/15.
 */
var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());

app.all('/*', function(req, res, next){
    // CORS headers
    res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-key');
    if(req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.all('/v1/*', [require('./server/middlewares/validateRequest')]);

app.use('/', require('./server/routes'));

// If no route is matched by now it must be a 404
app.use(function(req, res, next){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + server.address().port);
});