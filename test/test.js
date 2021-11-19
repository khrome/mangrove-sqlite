var should = require("chai").should();
var Indexed = require('indexed-set');
var MangroveSQLite = require('../driver');
var SQLite3 = require('better-sqlite3');

var data = require('./data.json');

describe('Mangrove PostgreSQL Adapter', function(){

    describe('.exists(<collection_name>, <options>, <callback>)', function(){

        it('tests existence and fails, with no object', function(done){

        });

        it('tests existence and creates a table and succeeds, with an object', function(done){

        });

    });

    var byId = (a, b)=>{ return a.id < b.id?-1:1 };

    var saveObjects = function(adapter, table_name, obs, cb){
        var primaryKey = 'id';
    }

    describe.skip('.saveCollection(<collection>, <name>, <options>, <callback>)', function(){

        it('saves some random objects', function(done){

        });

    });

    describe.skip('.loadCollection(<collection>, <name>, <options>, <callback>)', function(){

        it('can load some data we save immediately before', function(done){

        });

    });

});
