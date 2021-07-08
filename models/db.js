const MongoClient = require('mongodb').MongoClient;
// Connection url
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'microblog';
// Connect using MongoClient
MongoClient.connect(url, function(err, client) {
// Select the database by name
const blogDb = client.db(dbName);
client.close();
});