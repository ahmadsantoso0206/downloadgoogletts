var express = require('express');
var path = require('path');
var multiparty = require("multiparty");	
require('dotenv').config()
const { spawn } = require('child_process');

var bodyParser = require('body-parser');
var serverDispatcher = require('./dispatcher');
var getPostPayload = require('./core/get-post-payload');
var urlModule = require('url');
var initManager = require('./init-manager');
var router = express.Router();
var fs = require('fs-promise');
var fs2 = require('fs');
var binaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');
var FfmpegCommand = require('fluent-ffmpeg');
var command = new FfmpegCommand();
require('dotenv').config();
const app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
// process.env.PORT ||
io.on('connection', function (socket) {
	var addedUser = false;
	
	// when the client emits 'new message', this listens and executes
	socket.on('new message', function (data) {
		// we tell the client to execute 'new message'
		socket.broadcast.emit('new message', {
		username: socket.username,
		message: data
		});
	});
	
});

var port =process.env.PORT || 3000;

var LanguageDetect = 	require('languagedetect');
var lngDetector = new LanguageDetect();


var bootstrap = require("express-bootstrap-service");
	// OR
	// var lngDetector = new (require('languagedetect'));
	
	

	app.set('views','./v');
	app.set('view engine','ejs');
	app.use('/script',express.static(__dirname + '/public'));
	//app.use(express.static(path.join(__dirname, 'public')));
	app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
	app.use(bodyParser.json());


	router.use(function(req, res, next) {
		console.log(req.method, req.url);
		next();
	});    	
	var idx = router.route('/');
	var convertMP3 = router.route('/convert');
	var joinAudio = router.route('/join');
	var detectLang = router.route('/detect');

	
	
	// When a client connects, we note it in the console
	
	

	function startServer() {
		
		
		//var jsonParser = bodyParser.json();
		//app.use(bodyParser.urlEncoded());
		
		//	TODO: use express...
		app.get('/api/*', requestHandler);
		var lang;
		fs.readFile('json/languages.json', 'utf8', function (err, data) {
		if (err) throw err;
		lang = JSON.parse(data);
		});// =  JSON.parse(fs.readFile('n', 'utf8'));
		
		idx.get(function(req,res,next){
			res.render('index',{title:'Text To Speech Downloader',lang:lang});
			
			
			
		});
		
		//return;
		// app.get('/', requestHandler);
		// app.get('/robots.txt', requestHandler);
		
		// app.post('/api/*', requestHandler);

		
		
		app.use('/', router);
		
				
		server.listen(port, function () {
			console.log(`Server listening on: ${port}`);
			
		});
		
		//io.socket.emit('connect','connected');
		


		return initManager.start();
	}
	detectLang.post(function(req,res,next){
		var reqs = req.body;
		var query = reqs["query"];
		var a = lngDetector.detect(query,1);
		if (a.length > 0){
			var b=a[0];
			var result = b[0];
			res.end(result);
		}
		
	});
	
	convertMP3.post(function(req,res,next){
		var i = req.body;
		var song=[];
		var songs="";
		
		var list = [];
		var clientID=i["clientID"];
		var isFinished=0;
		for (var key in i){
			if (key!="clientID")
			list.push(i[key]);
		}
		
		var x = 0;
		
		var loopArray = function(arr) {
			// call itself
			customAlert(arr[x],x,function(){
				x++;
				// any more items in array?
				if(x < arr.length) {
						loopArray(arr);   
				}
				if (x==arr.length){
					
					songs="concat:"+song.join("|");
					res.end(songs);
					next();		
				}
			}); 
		}
		
		// start 'loop'
		loopArray(list);
		
		function customAlert(msg,count,callback) {
			var request = require('request');
			var options = {
				url: msg
			}
			
			var w = fs2.createWriteStream(count +'.mp3');
			var a = request(options).pipe(w);
			w.on('finish',function(){
				song.push(count +'.mp3');
				var percents = Math.ceil((count/list.length)*100);
				var ip = req.connection.remoteAddress;

				io.sockets.emit(clientID,percents);
				callback();
			})
			
		}
	
	


		
	})

	joinAudio.post(function(req,res,next){
		var reqs = req.body;
		var query = reqs["song"];
		var ffmpeg = spawn('ffmpeg', ['-i', query, '-c', 'copy', '-y', 'scripts/public/all.mp3']);
		// input_file.pipe(ffmpeg.stdin);
		// ffmpeg.stdout.pipe(output_stream);

		ffmpeg.stderr.on('data', function (data) {
			console.log(data.toString());
		});

		ffmpeg.stderr.on('end', function () {
			console.log('file has been converted succesfully');
		});

		ffmpeg.stderr.on('exit', function () {
			console.log('child process exited');
		});

		ffmpeg.stderr.on('close', function() {
			console.log('...closing time! bye');
			res.end("Successfuly Converted");
			next();
		});

	});

	


	//	TODO: replace it with express
	function requestHandler(request, response) {
		try {
			if (request.method === 'POST') {
				getPostPayload(request)
					.then(dataAsString => {
						var url = request.url;
						var data = JSON.parse(dataAsString);
						var dispatcherResult = serverDispatcher.request(url, data);

						handleDispatcherResult(
							request,
							response,
							dispatcherResult
						);
					});
			} else if (request.method === 'GET') {
				var url = request.url.split('?')[0];
				var data = urlModule.parse(request.url, true).query;
				var dispatcherResult = serverDispatcher.request(url, data);

				handleDispatcherResult(
					request,
					response,
					dispatcherResult
				);
			} else {
				rejectOnError(response, `Unknown method ${request.method}`);
			}
		} catch (err) {
			rejectOnError(response, err);
			serverDispatcher.ab
		}
	}

	function handleDispatcherResult(request, response, dispatcherResult) {
		console.info('Result type: ' + dispatcherResult.type);

		var action = dispatcherResult.type;
		var data = dispatcherResult.data;
		var contentType = dispatcherResult.contentType || 'application/json';

		if (action === 'PROXY') {
			request
				.pipe(data)
				.pipe(response);

		} else if (action === 'PROMISE/TEXT') {
			var header = {'Content-Type': contentType};

			data
				.then(responseData => {
					response.writeHead(200, header);
					response.end(JSON.stringify(responseData));
				})
				.catch(err => {
					rejectOnError(response, err);
				});
		} else {
			rejectOnError(response, `Unknown action: ${action}`);
		}
	}

	function rejectOnError(response, additionalData) {
	var errorMessage = additionalData || 'Unknown Error';
	console.error(errorMessage);

	response.writeHead(503, {'Content-Type': 'application/json'});
	response.end(JSON.stringify({error: errorMessage}));
	}

	function isAlive() {
		return server.listening
		&& initManager.isReady();
	}

	module.exports = {
		startServer: startServer,
		isAlive: isAlive
	};
