var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var index = require('./routes/index');
var register = require('./routes/register');
var login = require("./routes/login");
var settings = require('./routes/settings');
var accountSettings = require('./routes/accountSettings');
var saveBook = require('./routes/saveBook');
var deleteBook = require('./routes/deleteBook');
var books = require('./routes/books');
var clubBooks = require('./routes/clubBooks');
var trade = require('./routes/trade');
var tradesForUser = require('./routes/tradesForUser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

MongoClient.connect(process.env.MONGO_URI, function(err, db) {
    console.log("Successfully connected to MongoDB.");
    global.db = db;

    app.use('/', index);
    app.use('/register', register);
    app.use('/login', login);
    app.use('/settings', settings);
    app.use('/accountSettings', accountSettings);
    app.use('/saveBook', saveBook);
    app.use('/deleteBook', deleteBook);
    app.use('/books', books);
    app.use('/clubBooks', clubBooks);
    app.use('/trade', trade);
    app.use('/tradesForUser', tradesForUser);

// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
});

module.exports = app;
