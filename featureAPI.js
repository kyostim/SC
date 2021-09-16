module.exports =
{
   respond, update, deleteFeature 
}

var mysql = require('mysql');
var express = require('express');
var feature = require('./html/feature.js');


var con = new mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "centria1",
  database: "SC"
});


function respond(request, response)
{
  const featureID = request.query.id;
  
  
  
  if(!featureID)
  {
    con.query('SELECT * FROM Feature', (err,rows) => {
      if(err) throw err;
    
      response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8',
                                'Access-Control-Allow-Origin': '*'});
      response.write(JSON.stringify(rows));
      response.end();

    
    });
  }
  else
  {
    con.query('SELECT * FROM Feature WHERE ID=?',[featureID], (err,rows) => {
      if(err) throw err;
    
      response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8',
                                'Access-Control-Allow-Origin': '*'});
      response.write(JSON.stringify(rows));
      response.end();
    
    });
  }
}

function update(request, response)
{
  var newFeature = feature.featureFromJSON(request.body);
  
  var sql = "INSERT INTO Feature(name, type) VALUES ('"+ newFeature.name + "', '"+ newFeature.type +"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });

  response.json(request.body);

 //const thingID = request.query.id;
  //console.log('tulee');
}

function deleteFeature(request, response)
{
  var id = request.params.id;
  if(id > 0) {
    var sql = "DELETE FROM Feature WHERE id = " + id;
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