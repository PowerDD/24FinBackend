var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , config = require('./config.js')
  , i18n = require('i18n')
  , querystring = require('querystring')
  , fs = require('fs')
  , util = require('./objects/util');

i18n.configure({
	locales: ['th', 'en'],
	defaultLocale: 'th',
	directory: __dirname + '/locales'
});

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(requireHTTPS);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser(config.cookie.password));
  app.use(express.methodOverride());
  app.use(i18n.init);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('*', function(req, res, next) {

	if (typeof req.cookies.language == 'undefined') {
		res.cookie('language', 'th', {expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
		req.setLocale('th');
	} else {
		req.setLocale(req.cookies.language);
	}
	res.cookie('url', req.url, {expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});

	if ( req.url.indexOf('/language') == -1 &&
		req.url.indexOf('/auth') == -1 &&
		req.url.indexOf('/initial') == -1 &&
		req.url.indexOf('/logout') == -1
	) {
		if (typeof req.signedCookies.authKey != 'undefined') {
			var postString = querystring.stringify({
				authKey : req.signedCookies.authKey,
				system : 'backend',
				screen : req.url
			});
			util.postData(req, res, next, routes, 'checkAuth', '/member/screen/permission', postString);
		}
		else {
			res.redirect(config.loginUrl);
		}
	}
	else {
		next();
	}

});


app.get('/language/:lang', function(req, res) {	
	res.cookie('language', req.params.lang, {expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
	res.cookie('url', '/', {expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
	req.setLocale(req.params.lang);
	res.redirect(req.cookies.url);
});

app.get('/auth/:authKey/:lang/:remember', function(req, res, next) {	
	if (req.params.remember == '1')
		res.cookie('authKey', req.params.authKey, {signed: true, secure: true, expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
	else
		res.cookie('authKey', req.params.authKey, {signed: true, secure: true});
	
	res.cookie('language', req.params.lang, {expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
	res.cookie('url', '/', {expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});

	var postString = querystring.stringify({
		authKey : req.params.authKey
	});
	util.postData(req, res, next, routes, 'getMemberInfo', '/member/info/auth', postString);
});

app.get('/initial', function(req, res, next) {
	var postString = querystring.stringify({
		authKey : req.signedCookies.authKey
	});
	util.postData(req, res, next, routes, 'getMemberInfo', '/member/info/auth', postString);
});

app.get('/logout', function(req, res, next) {
	var querystring = require('querystring');
	var util = require('./objects/util');
	var postString = querystring.stringify({
		authKey : req.signedCookies.authKey
	});
	util.postData(req, res, next, routes, 'logout', '/member/logout', postString);
});


app.get('/', function(req, res) {	
	fs.exists('./public/javascripts/dashboard.js', function (exists) {
		routes.index(req, res, 'dashboard', exists ? '/javascripts/dashboard.js' : null);
	});
});

app.get('/teamwork', function(req, res) {	
	fs.exists('./public/javascripts/teamwork.js', function (exists) {
		routes.index(req, res, 'teamwork', exists ? '/javascripts/teamwork.js' : null);
	});
});

app.get('/product', function(req, res) {	
	fs.exists('./public/javascripts/product.js', function (exists) {
		routes.index(req, res, 'product', exists ? '/javascripts/product.js' : null);
	});
});

app.get('/cart', function(req, res) {	
	fs.exists('./public/javascripts/cart.js', function (exists) {
		routes.index(req, res, 'cart', exists ? '/javascripts/cart.js' : null);
	});
});

app.get('/commission', function(req, res) {	
	fs.exists('./public/javascripts/commission.js', function (exists) {
		routes.index(req, res, 'commission', exists ? '/javascripts/commission.js' : null);
	});
});

app.get('/member/:action', function(req, res) {
	fs.exists('./public/javascripts/member-'+req.params.action+'.js', function (exists) {
		routes.index(req, res, 'member-'+req.params.action, exists ? '/javascripts/member-'+req.params.action+'.js' : null);
	});
});

app.get('/admin/:action', function(req, res) {
	fs.exists('./public/javascripts/admin-'+req.params.action+'.js', function (exists) {
		routes.index(req, res, 'admin-'+req.params.action, exists ? '/javascripts/admin-'+req.params.action+'.js' : null);
	});
});

app.get('/report/:action', function(req, res) {
	fs.exists('./public/javascripts/report-'+req.params.action+'.js', function (exists) {
		routes.index(req, res, 'report-'+req.params.action, exists ? '/javascripts/report-'+req.params.action+'.js' : null);
	});
});

app.get('/customer/:action', function(req, res) {
	fs.exists('./public/javascripts/customer-'+req.params.action+'.js', function (exists) {
		routes.index(req, res, 'customer-'+req.params.action, exists ? '/javascripts/customer-'+req.params.action+'.js' : null);
	});
});

app.get('/customer/info/:id/:member', function(req, res) {
	fs.exists('./public/javascripts/customer-info.js', function (exists) {
		routes.index(req, res, 'customer-info', exists ? '/javascripts/customer-info.js' : null, req.params.id, req.params.member);
	});
});

app.get('/sales/:action', function(req, res) {
	fs.exists('./public/javascripts/sales-'+req.params.action+'.js', function (exists) {
		routes.index(req, res, 'sales-'+req.params.action, exists ? '/javascripts/sales-'+req.params.action+'.js' : null);
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

function requireHTTPS(req, res, next) {
    if (!req.get('x-arr-ssl')) {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}
