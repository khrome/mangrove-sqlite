const SQLite3 = require('better-sqlite3');
module.exports = {
  Adapter : require('mangrove-sql-adapter').extend({
      cleanup : function(){
          try{

          }catch(ex){}
      },
      client : function(usePooled){
          return SQLite3;
      },
      connect: function(name, options, handler, cb){
          if(!this.connection){
              this.connection = this.client(this.options.database, name);
          }
          setTimeout(()={
              cb(null, this.connection);
          })
          return this.connection;
      },
      loaderResultsHandler: function(err, res, itemHandler, cb){

      },
      existsResultsHandler: function(err, res, itemHandler, cb){

      },
      createResultsHandler: function(err, res, itemHandler, cb){

      },
      saveResultsHandler: function(err, res, itemHandler, cb){

      },
      sqlTypeFromJavascriptType : function(name, value, pk){
          var type = typeof value;
          if(type === 'object' && Array.isArray(value)) type = 'array';
          if(type === 'object' && value instanceof Date) type = 'datetime';
          if(type === 'number' && !isNaN(value)){
              // check if it is integer
              if( Number.isInteger(value) ) type = 'integer';
              else type = 'float';
          }
          var typeCreate;
          switch(type){
              case 'string' : typeCreate = 'VARCHAR (255)'; break;
              case 'integer' : typeCreate = 'INTEGER'; break;
              case 'bigint' : typeCreate = 'INTEGER'; break;
              case 'object' : typeCreate = 'BLOB'; break;
              case 'float' : typeCreate = 'REAL'; break;
              //todo: handle arrays + arrays of objects as FKs
          }
          if(!typeCreate) throw new Error('Unrecognized Type: '+type);
          if(name === pk ) return name + ' ' + typeCreate+ ' PRIMARY KEY';
          return name + ' ' + typeCreate+ ' NOT NULL';
      },
      createSQL: function(tableName, object, pk){
          var fields = Object.keys(object);
          var creates = [];
          fields.forEach((field)=>{
              creates.push(this.sqlTypeFromJavascriptType(field, object[field], pk));
          });
          var sql = 'CREATE TABLE '+tableName+'('+creates.join(', ')+')';
          return sql;
      },
      loaderSQL: function(tableName){
          return "SELECT * from "+tableName;
      },
      existsSQL : function(tableName){
          return "SELECT name FROM sqlite_master WHERE type='table' AND name='"+tableName+"';"
      },
      saveSQL : function(table, fields, pk, object, valuesFn){
          var values = [];
          fields.forEach((field)=>{
              values.push(object[field])
          });
          //everything needs to be rendered as symbols, so pg escaping can work
          var symbols = values.map((item, index)=> '$'+(index+1) );
          var commas = ', ';
          var query = 'INSERT INTO '+table+'('+fields.join(commas)+') '+
                      'VALUES ('+symbols.join(commas)+') '+
                      'ON CONFLICT('+pk+') '+
                      'DO UPDATE SET '+ fields.map(
                          (name, index)=> name+' = '+symbols[index]
                      ).join(commas);
          if(valuesFn) valuesFn(values);
          return query;
      }
  })
}
