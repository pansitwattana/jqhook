var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')


var admin = require('./routes/admin')

var routes = require('./routes/index')
var users = require('./routes/users')
var search = require('./routes/search')
var menu = require('./routes/menu')
var order = require('./routes/order')
var browse = require('./routes/browse')
var login = require('./routes/login')
var logout = require('./routes/logout')
var signup = require('./routes/signup')
var store = require('./routes/store')

var homepage = require('./routes/homepage') 

var firebase = require('./routes/database')

var app = express()
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')



app.use(allowCrossDomain);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(require('stylus').middleware(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')))


app.use('/', routes)

app.use('/admin', admin)

app.use('/users', users)
app.use('/search', search)
app.use('/menu', menu)
app.use('/order', order)
app.use('/browse', browse)
app.use('/login', login)
app.use('/logout', logout)
app.use('/signup', signup)
app.use('/store', store)

app.use('/homepage', homepage)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found')
	err.status = 404
	next(err)
})

var requireAuthentication = function requireAuthentication(req, res)
{
    console.log("Unauthorized")
}

app.all('*', requireAuthentication);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

    app.use(function (err, req, res, next) {

        if (firebase.auth().currentUser == null) {

        }

		res.status(err.status || 500)
		res.render('error', {
			message: err.message,
			error: err
		})
	})
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {

   

        res.status(err.status || 500)
        res.render('error', {
            message: err.message,
            error: {}
        })

    


})

module.exports = app