/*
tests for expresso
*/

var util      = require('util')
  , Memcache = require('../lib/memcache')
  , vows     = require('vows')
  , assert   = require('assert');

var host = 'localhost'
  , port = 11211
  , mc = new Memcache(port, host);

vows.describe('memcache')
.addBatch({
  'connect': {
    topic: function() {
      mc.connect();
      mc.on('connect', this.callback);
      mc.on('error', this.callback);
    }
    ,'connection established': function(err) {
      if (err) {
        if(err.errno == 111) throw new Error("You need to have a memcache server running on localhost:11211 for these tests to run");
        throw err;
      }
    }  
  }
})
.addBatch({
  // test nonexistent key is null
  'get with a bogus value': {
    topic: function() {
      mc.get('no such key', this.callback);
    }
    ,'returns null': function(err, ret) {
      if(err) throw err;
      assert.equal(ret, null);
    }
  }
  ,'set a test key': {
    topic: function() {
      mc.set('set1', 'asdf1', this.callback);
    }
    ,'returns STORED': function (err, ret) {
      if(err) throw err;
      assert.equal(ret, 'STORED');
    }
    ,'and fetch it back': {
      topic: function() {
        mc.get('set1', this.callback);
      }
      ,'returns the value that was set': function (err, ret) {
        if(err) throw err;
        assert.equal(ret.toString('utf8'), 'asdf1');
      }
    }
  }
})
.export(module);

/*  // test set, get and expires
  exports['test set, get, and expires'] = function(beforeExit) {
    var n = 0;
    // set key
    mc.set('set1', 'asdf1', function() {
      n++;
      mc.get('set1', function(err, r) {
        if(err) throw new Error(err);
        // assert key is found
        assert.equal('asdf1', r);
        n++;
        // assert key expires after 1s
        setTimeout(function() {
          mc.get('set1', function(r) {
            mc.close();
            assert.equal(null, r);
            n++;
          });
        }, 1000);
      });
    }, 10);
    
    beforeExit(function() {
      assert.equal(3, n);
    });
  };

  exports['test set get with integer value'] = function(beforeExit) {
    mc.set('testKey', 123, function() {
      mc.get('testKey', function(err, r) {
        assert.equal(123,r);
      });
    });
  };

  // test set and delete
  exports['test set del'] = function(beforeExit) {
    var n = 0;
    // set key
    mc.set('set2', 'asdf2', function() {
      n++;
      mc.get('set2', function(err, r) {
        // assert key is found
        assert.equal('asdf2', r);
        n++;
        // delete key
        mc.delete('set2', function() {
          mc.get('set2', function(err, r) {
            // assert key is null
            assert.equal(null, r);
            n++;
          });
        });
      });
    }, 0);
    
    beforeExit(function() {
      assert.equal(3, n);
    });
  };

  // test utf8 handling
  exports['utf8'] = function(beforeExit) {
    mc.set('key1', 'привет', function() {
      mc.get('key1', function(err, r) {
        assert.equal('привет', r);
      });
    });
  };


  // test connecting and disconnecting
  exports['con disco'] = function(beforeExit) {

    var n = 0;

    var mc2 = new memcache.Client(port, host);
    mc2.on('connect', function(){
      n++;
      mc2.close();
    });
    mc2.on('close', function(){
      n++;
    });

    mc2.connect();

    beforeExit(function() {
      assert.equal(2, n);
    });
  };

  // increment / decrement
  exports['inc dec'] = function(beforeExit){

    var n = 0;

    mc.set('inc_bad', 'HELLO', function(err, response){
      assert.equal(response, 'STORED');
      n++;
      mc.increment('inc_bad', 2, function(err, ok){
        n++;
        assert.match(err.message, /^CLIENT_ERROR/);
        assert.equal(ok, null);
      });
      mc.decrement('inc_bad', 3, function(err, ok){
        n++;
        assert.match(err.message, /^CLIENT_ERROR/);
        assert.equal(ok, null);
      });
      mc.increment('inc_bad', null, function(err, ok){
        n++;
        assert.match(err.message, /^CLIENT_ERROR/);
        assert.equal(ok, null);
      });
      mc.decrement('inc_bad', null, function(err, ok){
        n++;
        assert.match(err.message, /^CLIENT_ERROR/);
        assert.equal(ok, null);
      });
    });

    mc.set('inc_good', '5', function(err, response){
      assert.equal(response, 'STORED');
      n++;
      mc.increment('inc_good', 2, function(err, response){
        n++;
        assert.equal(response, 7);
        mc.increment('inc_good', function(err, response){
          n++;
          assert.equal(response, 8);
          mc.decrement('inc_good', function(err, response){
            n++;
            assert.equal(response, 7);
            mc.decrement('inc_good', 4, function(err, response){
              n++;
              assert.equal(response, 3);
            });
          });
        });
      });
    });

    beforeExit(function(){
      assert.equal(10, n);
    });

  };

  exports['version'] = function(beforeExit){
    var n = 0;

    mc.version(function(error, success){
      n++;
      assert.equal(error, null);
      assert.length(success, 18);
    });

    beforeExit(function(){
      assert.equal(1, n);
    });
  };

  exports['stats'] = function(beforeExit){
    var n = 0;
    beforeExit(function(){
      assert.equal(0, n);
    });
    return;

    mc.stats(function(error, success){
      n++;
      assert.ok(success.pid, "server has a pid");
    });

    mc.stats('settings', function(error, success){
      n++;
      assert.ok(success.maxconns);
    });

    mc.stats('items', function(error, success){ n++; assert.ok(num_keys(success)); });
    mc.stats('sizes', function(error, success){ n++; assert.ok(num_keys(success)); });
    mc.stats('slabs', function(error, success){ n++; assert.ok(num_keys(success)); });

    mc.stats('notreal', function(error, success){
      n++;
      assert.equal(error, 'ERROR');
    });
    
    beforeExit(function(){
      assert.equal(6, n);
    });

  };

});

*/

function num_keys(a){
  var i=0;
  for (var k in a) i++;
  return i;
}
