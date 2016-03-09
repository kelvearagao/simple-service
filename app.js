/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , contacts = require('./modules/contacts')
  , cors = require('cors');

var url = require('url');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer());

app.get('/contacts', function(request, response) {
	var get_params = url.parse(request.url, true).query;
	
	if (Object.keys(get_params).length == 0)
	{
		response.setHeader('content-type', 'application/json');
		response.end(JSON.stringify(contacts.list()));
	}
	else
	{
		var arg = Object.keys(get_params);
		var value = get_params[arg[0]];
		
		response.setHeader('content-type', 'application/json');
		response.end(JSON.stringify(contacts.query_by_arg(arg, value)));
	}
});

app.get('/contacts/:number', cors(), function(request, response) {
	response.setHeader('content-type', 'application/json');
	response.end(JSON.stringify(contacts.query(request.params.number)));
});

app.get('/groups', function(request, response) {
	console.log('Tets');
	
	// content negotiation!
	response.format({
		'application/json' : function() {
			console.log('json');
			response.send(JSON.stringify(contacts.list_groups()));
		},
		'text/xml' : function() {
			console.log('xml');
			response.send(contacts.list_groups_in_xml);
		},
		'default' : function() {
			console.log('default');
			response.status(406).send('Not Acceptable');
		}
	});
});

app.get('/groups/:name', function(request, response) {
	response.setHeader('content-type', 'application/json');
	response.end(JSON.stringify(contacts.get_members(request.params.name)));
});

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});