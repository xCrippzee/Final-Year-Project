var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";



function createConnection(cb){
  MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
    if (err) throw err;
    var dbo = db.db("collectd");
    cb(dbo);
}

function read(dbo, cb){
  dbo.collection("load").findOne({}, function(err, result) {
    if (err) throw err;
    console.log("Loading file");
    console.log(result.name);
    db.close;
}

function test(cb){
  createConnection(function(err, account)){
    if (err) return cb(err);
    read(dbo);
    cb();
  }
}

test(function(err){
  if (err){
    console.log("it done broked", err);
    process.exit(1);
  }
});
