var Duplex = require('stream').Duplex;
var browserChannel = require('../../node-browserchannel').server;

// Pass in pass through stream
module.exports = function (store, serverOptions, clientOptions) {
	if (!clientOptions) clientOptions = {};
	if (clientOptions.reconnect == null) clientOptions.reconnect = true;

	store.on('model', function (model) {
		model.on('bundle', function (bundle) {
			bundle.racerBrowserChannel = clientOptions;
		});
	});

	store.on('bundle', function (browserify) {
		browserify.add(__dirname + '/browser');
	});

	var middleware = browserChannel(serverOptions, function (client, connectRequest) {
		var rejected = false;
		var rejectReason;

		function reject(reason) {
			rejected = true;
			if (reason) rejectReason = reason;
		}

		store.emit('client', client, reject);
		if (rejected) {
			// Tell the client to stop trying to connect
			client.stop(function () {
				client.close(rejectReason);
			});
			return;
		}
		var stream = createBrowserChannelStream(client, store.logger);
		var agent = store.shareClient.listen(stream, connectRequest);
		store.emit('share agent', agent, stream);
	});
	return middleware;
};

/**
 * @param {EventEmitters} client is a browserchannel client session for a given
 * browser window/tab that is has a connection
 * @return {Duplex} stream
 */
function createBrowserChannelStream(client, logger) {
	var stream = new Duplex({objectMode: true});

	stream._write = function _write(chunk, encoding, callback) {
		// Silently drop messages after the session is closed
		if (client.state !== 'closed') {
			client.send(chunk);
			if (logger) {
				logger.write({type: 'S->C', chunk: chunk, client: client});
			}
		}
		callback();
	};
	// Ignore. You can't control the information, man!
	stream._read = function _read() {
	};

	client.on('message', function onMessage(data) {
		// Ignore Racer channel messages
		if (data && data.racer) return;

		// TODO KBS : 클라이언트로부터 연산 액션이 전달된다.
		// TODO KBS : 여기서 push가 되면, Session.pump로 전달된다. 그리고 Session._handleMessage로 들어가 요청을 처리하게 된다.
		stream.push(data);

		if (logger) {
			logger.write({type: 'C->S', chunk: data, client: client});
		}
	});

	stream.on('error', function onError() {
		client.stop();
	});

	client.on('close', function onClose() {
		stream.end();
		stream.emit('close');
		stream.emit('end');
		stream.emit('finish');
	});

	return stream;
}

function _checkRequest(req) {
	if (req.a === 'qsub' || req.a === 'qfetch' || req.a === 'qunsub') {
		// Query messages need an ID property.
		if (typeof req.id !== 'number') return 'Missing query ID';
	} else if (req.a === 'op' || req.a === 'sub' || req.a === 'unsub' || req.a === 'fetch') {
		// Doc-based request.
		if (req.c != null && typeof req.c !== 'string') return 'Invalid collection';
		if (req.d != null && typeof req.d !== 'string') return 'Invalid docName';

		if (req.a === 'op') {
			if (req.v != null && (typeof req.v !== 'number' || req.v < 0)) return 'Invalid version';
		}
	} else if (req.a === 'bs') {
		// Bulk subscribe
		if (typeof req.s !== 'object') return 'Invalid bulk subscribe data';
	} else {
		return 'Invalid action';
	}
}

function _handleMessage (req, callback) {
	// First some checks of the incoming request. Error will be set to a value if a problem is found.
	var error;
	if ((error = _checkRequest(req))) {
		console.warn('Warning: Invalid request from ', this.agent.sessionId, req, 'Error: ', error);
		return callback(error);
	}

	if (req.a === 'qsub' || req.a === 'qfetch' || req.a === 'qunsub') {
		// Query based request.

		// Queries have an ID to refer to the particular query in the client
		var qid = req.id;

		// The index that will handle the query request. For mongo queries, this is
		// simply the collection that contains the data.
		var index = req.c;

		// Options for liveDB.query.
		var qopts = {};

		if (req.o) {
			// Do we send back document snapshots for the results? Either 'fetch' or 'sub'.
			qopts.docMode = req.o.m;
			if (qopts.docMode != null && qopts.docMode !== 'fetch' && qopts.docMode !== 'sub')
				return callback('invalid query docmode: ' + qopts.docMode);
			// Fill in known query data a previous session. Ignored if docMode isn't defined.
			qopts.versions = req.o.vs;
			// Enables polling mode, which forces the query to be rerun on the whole
			// index, not just the edited document.
			qopts.poll = req.o.p;
			// Set the backend for the request (useful if you have a SOLR index or something)
			qopts.backend = req.o.b;
		}
	} else if (req.a !== 'bs') {
		// Document based query.
		if (req.d === null) {
			// If the doc is null, we should generate a unique doc ID for the client.
			// This is not currently tested and probably broken. Don't tell people
			// about this feature.
			this.lastReceivedCollection = req.c;
			req.d = this.lastReceivedDoc = hat();
		} else if (req.d !== undefined) {
			this.lastReceivedCollection = req.c;
			this.lastReceivedDoc = req.d;
		} else {
			if (!this.lastReceivedDoc || !this.lastReceivedCollection) {
				console.warn("msg.d or collection missing in req " + JSON.stringify(req) + " from " + this.agent.sessionId);
				return callback('collection or docName missing');
			}

			req.c = this.lastReceivedCollection;
			req.d = this.lastReceivedDoc;
		}

		var collection = req.c;
		var docName = req.d;
	}

	var self = this;
	var agent = this.agent;

	// TODO KBS  :  Now process the actual message.
	switch (req.a) {
		case 'fetch':
			// Fetch request.
			if (req.v != null) {
				// It says fetch on the tin, but if a version is specified the client
				// actually wants me to fetch some ops.
				agent.getOps(collection, docName, req.v, -1, function (err, results) {
					if (err) return callback(err);

					for (var i = 0; i < results.length; i++) {
						self._sendOp(collection, docName, results[i]);
					}

					callback(null, {});
				});
			} else {
				// Fetch a snapshot.
				agent.fetch(collection, docName, function (err, data) {
					if (err) return callback(err);

					callback(null, {data: data});
				});
			}
			break;

		case 'sub':
			// Subscribe to a document. If the version is specified, we'll catch the
			// client up by sending all ops since the specified version.
			//
			// If the version is not specified, the client doesn't have a snapshot
			// yet. We'll send them a snapshot at the most recent version and stream
			// operations from that version.

			if (this._isSubscribed(collection, docName)) return callback('Already subscribed');
			this._subscribe(collection, docName, req.v, function (err, data) {
				if (err)
					callback(err);
				else
					callback(null, {data: data});
			});
			break;

		case 'bs':
			this.bulkSubscribe(req.s, function (err, response) {
				callback(err, err ? null : {s: response});
			});
			break;

		case 'unsub':
			// Unsubscribe from the specified document. This cancels the active
			// opstream.
			var opstream = this._isSubscribed(collection, docName);
			if (!opstream) return callback('Already unsubscribed');

			if (typeof opstream === 'object') {
				// The document is only half open. We'll _setSubscribed to
				// false and rely on the subscribe callback to destroy the event stream.
				opstream.destroy();
			}
			this._setSubscribed(collection, docName, false);
			callback(null, {});
			break;

		case 'op':
			// Submit an operation.
			//
			// Shallow clone to get just the op data parts.
			var opData = {op: req.op, v: req.v, src: req.src, seq: req.seq};
			if (req.create) opData.create = req.create;
			if (req.del) opData.del = req.del;

			// Fill in the src and seq with the client's data if its missing.
			if (!req.src) {
				opData.src = agent.sessionId;
				opData.seq = this.seq++;
			}

			// There's nothing to put in here yet. We might end up with some stuff
			// from the client.
			var options = {};

			// Actually submit the op to the backend
			agent.submit(collection, docName, opData, options, function (err, v, ops) {
				if (err) {
					console.trace(err);
				}
				if (err) return callback(null, {a: 'ack', error: err});

				// The backend replies with any operations that the client is missing.
				// If the client is subscribed to the document, it'll get those
				// operations through the regular subscription channel. If the client
				// isn't subscribed, we'll send the ops with the response as if it was
				// subscribed so the client catches up.
				if (!self._isSubscribed(collection, docName)) {
					for (var i = 0; i < ops.length; i++)
						self._sendOp(collection, docName, ops[i]);
					// Luckily, the op is transformed & etc in place.
					self._sendOp(collection, docName, opData);
				}

				callback(null, {a: 'ack'});
			});
			break;


		// ********* Queries **********

		case 'qfetch':
			// Fetch the results of a query. This does not subscribe to the query or
			// anything, its just a once-off query fetch.
			agent.queryFetch(index, req.q, qopts, function (err, results, extra) {
				if (err) return callback(err);

				// If the query subscribes to documents, the callback isn't called
				// until all the documents are subscribed.
				var data = self._processQueryResults(results, qopts);

				callback(null, {id: qid, data: data, extra: extra});
				//self._reply(req, null, {id:qid, data:results, extra:extra});
			});
			break;

		case 'qsub':
			// Subscribe to a query. The client is sent the query results and its
			// notified whenever there's a change.
			agent.query(index, req.q, qopts, function (err, emitter) {
				if (err) return callback(err);
				if (self.queries[qid]) return callback('ID in use');

				// 'emitter' is an event emitter passed through from LiveDB that emits
				// events whenever the results change. Livedb is responsible for
				// rerunning queries in the most efficient (or most expedient) manner.
				//
				// Note that although the emitter looks the same as what LiveDB
				// produces, the useragent code actually proxies the event emitter here
				// so it can rewrite & check any results that pass through.
				self.queries[qid] = emitter;

				// The actual query results are simply mixed in to the emitter (in
				// emitter.data). Callback called in a process.nextTick(), at the earliest.
				var data = self._processQueryResults(emitter.data, qopts);

				// Its possible that this will be called even when there's an error
				// subscribing or something. In that case, just the failed subscribe
				// will error to the client.
				//self._reply(req, null, {id:qid, data:emitter.data, extra:emitter.extra});
				callback(null, {id: qid, data: data, extra: emitter.extra});

				emitter.on('extra', function (extra) {
					self._send({a: 'q', id: qid, extra: extra});
				});

				emitter.on('diff', function (diff) {
					for (var i = 0; i < diff.length; i++) {
						var d = diff[i];
						if (d.type === 'insert') {
							d.values = self._processQueryResults(d.values, qopts);
						}
					}

					// Consider stripping the collection out of the data we send here
					// if it matches the query's index.
					self._send({a: 'q', id: qid, diff: diff});
				});

				emitter.on('error', function (err) {
					// Should we destroy the emitter here?
					self._send({a: 'q', id: qid, error: err});
					delete self.queries[qid];
				});
			});
			break;

		case 'qunsub':
			// Unsubscribe from a query.
			var query = self.queries[qid];
			if (query) {
				query.destroy();
				delete self.queries[qid];
			}
			callback();
			break;

		default:
			console.warn('invalid message', req);
			callback('invalid or unknown message');
	}
};

