var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if(cluster.isMaster) {
	for(var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('death', function(worker) {
		console.log('worker ' + worker.pid + " died.");
	});
}
else {
	var app,
		coffeeify = require('coffeeify'),
		express = require('express'),
		fs = require('fs'),
		http = require('http'),
		liveDbMongo = require('livedb-mongo'),
		port,
		racer = require('./racer'),
		racerBrowserChannel = require('./racer-browserchannel'),
		redis = require('redis').createClient(),
		scriptBundle,
		store,
		templates = require('./templates');

	console.log('Worker : %s', process.env.NODE_WORKER_ID);

	racer.use(require('./racer-bundle'));
	redis.select(13);

	store = racer.createStore({
		db: liveDbMongo('localhost:27017/qsheet?auto_reconnect', {
			safe: true
		}),
		redis: redis
	});

	app = express();

	app.use(express.favicon());
	app.use(express.compress());
	app.use(express.cookieParser('qsheet'));
	app.use(express.session());
	app.use(express["static"](__dirname + '/public'));
	app.use(express.cookieParser('qsheet'));
	app.use(racerBrowserChannel(store));
	app.use(store.modelMiddleware());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());

	app.use(function (err, req, res, next) {
		console.error(err.stack || (new Error(err)).stack);
		return res.send(500, 'Something broke!');
	});

	store.on('bundle', function (browserify) {
		return browserify.transform(coffeeify);
	});

	scriptBundle = function (cb) {
		var scriptStoreBundle = store.bundle(__dirname + '/client.js', {
			extensions: ['.js']
		}, function (err, js) {
			if (err) {
				return cb(err);
			}
			return cb(null, js);
		});
		return scriptStoreBundle;
	};

	if (racer.util.isProduction) {
		scriptBundle(function (err, js) {
			if (err) {
				return;
			}

			return scriptBundle = function (cb) {
				return cb(null, js);
			};
		});
	}

	app.get('/script.js', function (req, res, next) {
		return scriptBundle(function (err, js) {
			if (err) {
				return next(err);
			}

			res.type('js');
			return res.send(js);
		});
	});

	app.post('/loginauth', function (req, res) {
		if(req.body.username) {
			console.log("login successful");
			//Setting in the cookies some variable useful later
			req.session.userAuthenticated = true;
			req.session.username = req.body.username;
			req.session.experience = result[0].doc.Experience;

			res.send(200);
		}
	});

	app.get('/qsheet', function (req, res) {

		redirectQheet(req, res);

		/*
		if(req.session.name) {
			redirectQheet();
		}
		else {
			return res.send(404, 'Session not found.');
		}
		*/
	});

	function redirectQheet(req, res) {
		var qsheetId = req.params.qsheetId;

		if (!qsheetId) {
			qsheetId = 0;
		}
		return res.redirect('/qsheet/' + qsheetId);
	}

	// get, post, put(수정, 추가), delete(삭제)
	app.put('/qsheet/:qsheetId', function(req, res, next) {

	});


	app.get('/qsheet/:qsheetId', function (req, res, next) {
		var qsheet, qsheetId, model;

		qsheetId = req.params.qsheetId;

		console.log('qsheetId : ' + qsheetId);

		if (!/^[a-zA-Z0-9_-]+$/.test(qsheetId)) {
			return next();
		}

		res.setHeader('Cache-Control', 'no-store');

		model = req.getModel();

		// 큐시트 ID로 해당 큐시트를 가져온다.
		qsheet = model.at("qsheet." + qsheetId);

		return qsheet.subscribe(function (err) {
			var id0, id1, id2, qsheetItems, listModel;
			if (err) {
				return next(err);
			}

			// 큐시트 아이템 목록을 가져온다.
			qsheetItems = qsheet.at('qsheetItems');

			// 아이템이 하나도 없는 경우 기본 값들로 설정한다.
			if (!qsheetItems.get()) {
				id0 = model.add('item', {
					idx: 0,
					completed: false,
					text: 'Opening',
					type: 'Opening'
				});

				id1 = model.add('item', {
					idx: 1,
					completed: false,
					text: 'Closing',
					type: 'Closing'
				});

				id2 = model.add('item', {
					idx: 2,
					completed: false,
					text: 'END',
					type: 'END'
				});

				// 아이템들을 저장.
				qsheetItems.set([id0, id1, id2]);
			}

			return model.query('item', qsheetItems).subscribe(function (err) {
				var context, list;

				if (err) {
					return next(err);
				}

				list = model.refList('_qsheet.list', 'item', qsheetItems);

				context = {
					list: list.get(),
					qsheetId: qsheetId
				};

				return model.bundle(function (err, bundle) {
					if (err) {
						return next(err);
					}

					context.bundle = bundle;

					return res.send(templates.page(context))
				});
			});
		});
	});

	port = 3000;
	http.createServer(app).listen(port, function () {
		return console.log('Go to http://localhost:' + port);
	});
}



