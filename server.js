var mysql = require('mysql');
var express = require('express');
var thingAPI = require('./thingAPI.js');
var featureAPI = require('./featureAPI.js');
var relationshipAPI = require('./relationshipAPI.js');
var featureValueAPI = require('./featurevalueAPI.js');
const bodyParser = require('body-parser'); 
const cors = require('cors');
var config = require('./html/config.js');


var app = express();

app.use(express.json());
app.use(cors());

app.get('/thing', function (req, res) {
  console.log('thing get');
  thingAPI.respond(req,res);
})

app.put('/thing/:id', function (req, res) {
  console.log('thing/:id put');
  thingAPI.update(req,res);
})

app.put('/thing', (req, res) => {
  console.log('thing put');
  thingAPI.update(req,res);
});

app.delete('/thing/:id', function (req, res) {
  console.log('thing/:id delete');
  thingAPI.deleteThing(req,res);
})

//Features
app.get('/feature', function (req, res) {
  console.log('feature get');
  featureAPI.respond(req,res);
})

app.put('/feature/:id', function (req, res) {
  console.log('feature/:id put');
  featureAPI.update(req,res);
})

app.put('/feature', (req, res) => {
  console.log('feature put');
  featureAPI.update(req,res);
});

app.delete('/feature/:id', function (req, res) {
  console.log('feature/:id delete');
  featureAPI.deleteFeature(req,res);
})

//Relationships
app.get('/relationship', function (req, res) {
  console.log('relationship get');
  relationshipAPI.respond(req,res);
})

app.put('/relationship/:id', function (req, res) {
  console.log('relationship/:id put');
  relationshipAPI.update(req,res);
})

app.put('/relationship', (req, res) => {
  console.log('relationship put');
  relationshipAPI.update(req,res);
});

app.delete('/relationship/:id', function (req, res) {
  console.log('relationship/:id delete');
  relationshipAPI.deleteRelationship(req,res);
})

//FeatureValue
app.get('/featurevalue', function (req, res) {
  console.log('featurevalue get');
  featureValueAPI.respond(req,res);
})

app.put('/featurevalue/:id', function (req, res) {
  console.log('featurevalue/:id put');
  featureValueAPI.update(req,res);
})

app.put('/featurevalue', (req, res) => {
  console.log('featurevalue put');
  featureValueAPI.update(req,res);
});

app.delete('/featurevalue/:id', function (req, res) {
  console.log('featurevalue/:id delete');
  featureValueAPI.deleteFeatureValue(req,res);
})




//app.listen(8000, function(){
app.listen(config.basePort, function(){
  console.log("Listening port " + config.basePort);
})
