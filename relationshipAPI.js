module.exports =
{
   respond, update, deleteRelationship
}

var mysql = require('mysql');
var express = require('express');
var relationship = require('./html/releationship.js');


var con = new mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "centria1",
  database: "SC"
});

function respond(request, response)
{
  const relationshipID = request.query.id;
  
  
  
  if(!relationshipID)
  {
    con.query('SELECT * FROM Relationship', (err,rows) => {
      if(err) throw err;
    
      response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8',
                                'Access-Control-Allow-Origin': '*'});
      response.write(JSON.stringify(rows));
      response.end();

    
    });
  }
  else
  {
    //con.query('SELECT * FROM Relationship WHERE ID=?',[featureID], (err,rows) => {
    var sql = "SELECT * FROM Relationship WHERE ID=" + relationshipID
    con.query(sql, (err,rows) => {
        if(err) throw err;
    
        response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8',
                                    'Access-Control-Allow-Origin': '*'});
        if(rows.length === 1)
        {
            response.write(JSON.stringify(rows[0]));
        }
        response.end();
        
        });
  }
}

function update(request, response)
{
  var newRelationship = relationship.relationshipFromJSON(request.body);
  
  if(newRelationship.id > 0) {
    var sqlDefinition = "UPDATE Relationship SET ";
    sqlDefinition = sqlDefinition + "ParentID=" + (newRelationship.parentid > 0 ? newRelationship.parentid : "NULL");
    sqlDefinition = sqlDefinition + " ,ThingID=" + (newRelationship.thingid > 0 ? newRelationship.thingid : "NULL");
    sqlDefinition = sqlDefinition + " ,Name='" + newRelationship.name +"'";


    /*var comma = false;
    if(newRelationship.parentid > 0) {
        sqlDefinition = sqlDefinition + "ParentID=" + newRelationship.parentid;
        comma = true;
    }
    if(newRelationship.thingid > 0) {
        if(comma) sqlDefinition = sqlDefinition + ", ";
        sqlDefinition = sqlDefinition + "ThingID=" + newRelationship.thingid;
        comma = true;
    }
    if(newRelationship.name !== '') {
        if(comma) sqlDefinition = sqlDefinition + ", ";
        sqlDefinition = sqlDefinition + "Name='" + newRelationship.name +"'";
        comma = true;
    }*/

    var sql = sqlDefinition + " WHERE ID=" + newRelationship.id;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record updated");
    });
  }
  else {
        var sqlDefinition = "INSERT INTO Relationship(Name";
        var sqlValue = " VALUES('"+ newRelationship.name + "'";
        if(newRelationship.parentid > 0) {
            sqlDefinition = sqlDefinition + " ,ParentID";
            sqlValue = sqlValue + " ," + newRelationship.parentid;
        }
        if(newRelationship.thingid > 0) {
            sqlDefinition = sqlDefinition + " ,ThingID";
            sqlValue = sqlValue + " ," + newRelationship.thingid;
        }
        var sql = sqlDefinition + ")" + sqlValue + ")";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    }

  response.json(request.body);

 //const thingID = request.query.id;
  //console.log('tulee');
}

function deleteRelationship(request, response)
{
  var id = request.params.id;
  if(id > 0) {
    var sql = "DELETE FROM Relationship WHERE id = " + id;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Number of records deleted: " + result.affectedRows);
    });
  }


  response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8',
                                'Access-Control-Allow-Origin': '*'});
  response.end();
}