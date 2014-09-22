var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var db = require('./routes/db');
var pizinstance = require('./routes/pizinstance');

var routes = require('./routes/index');
var admin = require('./routes/admin');
var orders = require('./routes/orders');
var login = require('./routes/login');
var register = require('./routes/register');

var app = express();

var ip = "111.119.218.31";
var port = Number(process.env.PORT || 5000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', login);
app.use('/pizza', routes);
app.use('/admin', admin);
app.use('/orders', orders);
app.use('/register', register);

/*
app.get('/*', function(req, res, next){ 
  res.setHeader('Last-Modified', (new Date()).toUTCString());
  next(); 
});
*/

//app.disable('etag');

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(port,function(){
    console.log('server is listening to port '+port+' on '+ip);
    });

module.exports = app;
