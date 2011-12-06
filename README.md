node.js memcached client
========================

A pure-JavaScript memcached library for node.

Note: this library is a derivative work of the parent project to support binary values stored in memcache (the original would mangle them with utf8 conversions).  It has 2 significant behavoral changes.
* get returns a Buffer object instead of a String object
* all errors return proper Javascript Error objects instead of strings

Tests
-----

To run the test suite, first insall <a href="http://github.com/visionmedia/expresso">expresso</a>,
then run <code>make test</code>.

If you have <a href="http://github.com/visionmedia/node-jscoverage">node-jscoverage</a> you can
also <code>make test-cov</code> for coverage, but that's pretty nerdy.


Usage
-----

Create a Client object to start working.
Host and port can be passed to the constructor or set afterwards.
They have sensible defaults. 

	var Memcache = require('memcache');

	var mc = new Memcache(port, host);
	mc.port = 11211;
	mc.host = 'localhost';

The Client object emits 4 important events - connect, close, timeout and error.

	mc.on('connect', function(){
		// no arguments - we've connected
	});

	mc.on('close', function(){
		// no arguments - connection has been closed
	});

	mc.on('timeout', function(){
		// no arguments - socket timed out
	});

	mc.on('error', function(e){
		// there was an error - exception is 1st argument
	});
	
	// connect to the memcache server after subscribing to some or all of these events
	client.connect()

After connecting, you can start to make requests.

	mc.get('key', function(error, result){
		// all of the callbacks have two arguments.
		// 'result' may contain things which aren't great, but
		// aren't really errors, like 'NOT_STORED'
	});

	mc.set('key', 'value', function(error, result){
		// lifetime is optional. the default is
		// to never expire (0)
	}, lifetime);

	mc.delete('key', function(error, result){
		// delete a key from cache.
	});

	mc.version(function(error, result)){
		// grab the server version
	});


There are all the commands you would expect.

	// all of the different "store" operations
	// (lifetime & flags are both optional)
	mc.set(key, value, callback, lifetime, flags);
	mc.add(key, value, callback, lifetime, flags);
	mc.replace(key, value, callback, lifetime, flags);
	mc.append(key, value, callback, lifetime, flags);
	mc.prepend(key, value, callback, lifetime, flags);
	mc.cas(key, value, unique, callback, lifetime, flags);

	// increment and decrement (named differently to the server commands - for now!)
	// (value is optional, defaults to 1)
	mc.increment('key', value, callback);
	mc.decrement('key', value, callback);

	// statistics. the success argument to the callback
	// is a key=>value object
	mc.stats(callback);
	mc.stats('settings', callback);
	mc.stats('items', callback);
	mc.stats('mongeese', callback);

Once you're done, close the connection.

	mc.close();

There might be bugs. I'd like to know about them.

I bet you also want to read the <a href="http://github.com/memcached/memcached/blob/master/doc/protocol.txt">memcached 
protocol doc</a>. It's exciting! It also explains possible error messages.
