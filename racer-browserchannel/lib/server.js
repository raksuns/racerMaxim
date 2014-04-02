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

		console.log(JSON.stringify(data));
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

	// TODO KBS  :  Now process the actual message.
	switch (req.a) {
		case 'fetch':
			// Fetch request.
			break;

		case 'sub':
			// Subscribe to a document. If the version is specified, we'll catch the
			// client up by sending all ops since the specified version.
			//
			// If the version is not specified, the client doesn't have a snapshot
			// yet. We'll send them a snapshot at the most recent version and stream
			// operations from that version.
			break;

		case 'bs':
			break;

		case 'unsub': // 삭제되면 수행됨
			// Unsubscribe from the specified document. This cancels the active
			// opstream.

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


			break;


		// ********* Queries **********

		case 'qfetch':
			// Fetch the results of a query. This does not subscribe to the query or
			// anything, its just a once-off query fetch.

			break;

		case 'qsub':
			// Subscribe to a query. The client is sent the query results and its
			// notified whenever there's a change.

			break;

		case 'qunsub':
			// Unsubscribe from a query.

			break;

		default:
			console.warn('invalid message', req);
			callback('invalid or unknown message');
	}
};

