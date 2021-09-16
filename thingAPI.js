module.exports =
{
   respond, update, deleteThing 
}

var mysql = require('mysql');
//var mysql = require('sync-mysql');
var express = require('express');
var thing = require('./html/thing.js');
//import thing from './html/thing.js';

var con = new mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "centria1",
  database: "SC"
});


function respond(request, response)
{
  const thingID = request.query.id;
  
  
  
  if(!thingID)
  {
    con.query('SELECT * FROM Thing', (err,rows) => {
      if(err) throw err;
    
      response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8',
                                'Access-Control-Allow-Origin': '*'});
      response.write(JSON.stringify(rows));
      response.end();

    
    });
  }
  else
  {
    var sql = "SELECT * FROM Thing WHERE ID=" + thingID
    //con.query('SELECT * FROM Thing WHERE ID=?',[thingID], (err,rows) => {
    con.query(sql, (err,rows) => {
      if(err) throw err;

      response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8',
                                'Access-Control-Allow-Origin': '*'});
      response.write(JSON.stringify(rows));
      response.end();
    
      //response.writeHead(200, {'Content-Type': 'application/json'});
      //response.end({data:rows});
      //response.json({data:rows})
    
    });
  }
  //const result = connection.query('SELECT * FROM Thing');
  //res.writeHead(200, {'Content-Type': 'text/plain'});
  //res.end('result');
  /*
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  
    con.query("SELECT * FROM Thing", function (err, result, fields) {
      if (err) throw err;
      console.log(result);    
    });

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(result);
    });
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('result');
  */
}

function update(request, response)
{
  var newThing = thing.thingFromJSON(request.body);
  
  var sql = "INSERT INTO Thing(name) VALUES ('"+ newThing.name + "')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });

  response.json(request.body);

 //const thingID = request.query.id;
  //console.log('tulee');
}

function deleteThing(request, response)
{
  console.log("tulee");
  var id = request.params.id;
  if(id > 0) {
    var sql = "DELETE FROM Thing WHERE id = " + id;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Number of records deleted: " + result.affectedRows);
    });
  }


  response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8',
                                'Access-Control-Allow-Origin': '*'});
  response.end();
}








//});*/