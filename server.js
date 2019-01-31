const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var arr = [];
var checkOptions = [];
var selected = "";

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));

app.get('/', function(req,res){
  arr = [];
  createConnection(function(err, dbo){
    if (err) {
      console.log("Broken", err);
    }
    var cursor2 = dbo.listCollections({}, {nameOnly:true}).toArray(function(err, results){
      if (err) throw err;
      console.log("Loading Collections");

      results.forEach(element => {
        arr.push(element.name);
      });
      console.log(arr);
      res.render('index', {rows:arr, selection:selected, data:null, keys:null, chartData:null, checkOptions:checkOptions});
    })
  })

})

app.post('/collection', function(req,res){
  selected = req.body.selectpicker;
  console.log("Option picked is ", selected);

  createConnection(function(err, dbo){
    if (err){
      console.log("Connection Failed", err);
    }
    dbo.collection(selected).find({}, {host: 1, types_instance: 1, values: 1}).limit(30).toArray(function(err, results){
      if (err) throw err;
      console.log("loading");
      var chartData = [];
      var timestampData = [];
      checkOptions = []
      results.forEach(element => {
        timestampData.push(element.timestamp);
        chartData.push(element.values);
        if (!checkOptions.includes(element.type_instance)){ //Only add new options to the radio check
          checkOptions.push(element.type_instance);
        }
      })
      res.render('index', {selection:selected, rows:arr, chartData:null, checkOptions:checkOptions});
    })
  })


})

app.post('/collection/graph', function(req,res){
  console.log(req.body.graphOption);
  var graphOption = req.body.graphOption;
  createConnection(function(err, dbo){
    if (err){
      console.log("Connection Failed", err);
    }
    dbo.collection(selected).find({types_instance:graphOption}, {host: 1, types_instance: 1, values: 1}).limit(30).toArray(function(err, results){
      if (err) throw err;
      console.log("loading");
      var chartData = [];
      var timestampData = [];
      results.forEach(element => {
        timestampData.push(element.timestamp);
        chartData.push(element.values);
      })

      var chartData = {
        labels: timestampData,
        datasets: [{
          label: 'Testing',
          data: chartData,
          backgroundColor: [
          'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)'
          ],
          borderWidth: 1
        }]
      };

      res.render('index', {selection:selected, rows:arr, chartData:chartData, checkOptions:checkOptions});
    })
  })
})

app.listen(3000, function(){
  console.log("Testing and listening on port 3000")
})

function createConnection(cb){
  MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
    if (err) throw err;
    var dbo = db.db("collectd");
    cb(null, dbo);
})
}

function read(dbo, coll, cb){
  var cursor = dbo.collection(coll).find({}, {host: 1, type_instance: 1, values:1}).toArray( function(err, results){
    if (err) throw err;
    console.log("loading");
    console.log(results);
  })

  //, function(err, result) {
  //  if (err) throw err;
  //  console.log("Loading file");
  //  console.log(result);
    dbo.close;
}



function test(coll, cb){
  createConnection(function(err, dbo){
    if (err) return cb(err);
    read(dbo, coll);
    cb();
  })
}
