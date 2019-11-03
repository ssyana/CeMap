(function () {
    var createError = require('http-errors');
    var express = require('express');
    var path = require('path');
    var cookieParser = require('cookie-parser');
    var logger = require('morgan');
    var indexRouter = require('./routes/index');
    var usersRouter = require('./routes/users');
    var http = require('http');
    var app = express();
//设置跨域访问
    app.all('*',function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        next();
    });
    app.use(express.static(path.join(__dirname, 'public')));

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(logger('dev'));
    app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use('/', indexRouter);
    app.use('/users', usersRouter);


// error handler
//     app.use(function (err, req, res, next) {
//         // set locals, only providing error in development
//         res.locals.message = err.message;
//         res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//         // render the error page
//         res.status(err.status || 500);
//         res.render('error');
//         res.header('Access-Control-Allow-Origin', '*');
//         res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//         next();
//     });
module.exports = app;

    /**
     * Create HTTP server.
     */

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})

})();