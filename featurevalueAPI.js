module.exports =
{
   respond, update, deleteFeatureValue 
}

var mysql = require('mysql');
var express = require('express');
var featurevalue = require('./html/featurevalue.js');


var con = new mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "centria1",
  database: "SC"
});


function respond(request, response)
{
  const featureValueID = request.query.id;

  var sql = 'SELECT * FROM FeatureValue';
  if(!featureValueID) {
        const thingID = request.query.thingid;
        if(thingID) {
            sql = sql + " WHERE ThingID=" + thingID;   
        }
  }
  else
  {
    sql = sql + " WHERE ID=" + featureValueID;    
  }

  con.query(sql, (err,rows) => {
    if(err) throw err;

    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8',
                                'Access-Control-Allow-Origin': '*'});
    if(rows.length === 1 && featureValueID) {
        response.write(JSON.stringify(rows[0]));
    }
    else {
        response.write(JSON.stringify(rows));
    }

    response.end();
    
    });
}

function update(request, response)
{
  var newFeatureValue = featurevalue.featurevalueFromJSON(request.body);
  
  if(newFeatureValue.id > 0)
  {
    var sqlDefinition = "UPDATE FeatureValue SET ";
    sqlDefinition = sqlDefinition + "ThingID=" + newFeatureValue.thingid;
    sqlDefinition = sqlDefinition + " ,FeatureID=" + newFeatureValue.featureid;
    sqlDefinition = sqlDefinition + " ,Value='" + newFeatureValue.value +"'";

    var sql = sqlDefinition + " WHERE ID=" + newFeatureValue.id;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record updated");
    });
  }
  else {
    var sql = "INSERT INTO FeatureValue(ThingID, FeatureID, Value ) VALUES ("+ newFeatureValue.thingid + ", "+ newFeatureValue.featureid +" ,'" + newFeatureValue.value +"')";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        });
  }

  response.json(request.body);
}

function deleteFeatureValue(request, response)
{
  var id = request.params.id;
  if(id > 0) {
    var sql = "DELETE FROM FeatureValue WHERE id = " + id;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Number of records deleted: " + result.affectedRows);
    });
  }
  response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8',
                                'Access-Control-Allow-Origin': '*'});
  response.end();
}
