const MongoClient = require('mongodb').MongoClient;
// Connection url
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'microblog123';
function User(user) {
    this.name = user.name;
    this.password = user.password;
    };
    module.exports = User;
    User.prototype.save = function save(callback) {
    // 存入 Mongodb 的文档
    var user = {
    name: this.name,
    password: this.password,
    };
    MongoClient.connect(url,{ useNewUrlParser: true,useUnifiedTopology: true }, function(err, client) {
        if (err) throw err;
        client.db(dbName).collection('users').insertOne(user,function(err,res){
            if (err) throw err;
            console.log("文档插入成功");
            client.close();
            callback(err, user);
       });
    });
};
User.get = function get(username, callback) {
    MongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology: true }, function(err, db) {
        // 查找 name 属性为 username 的文档
        db.db(dbName).collection('users').findOne({name: username}, function (err, doc) {
            db.close();
            if (doc) {
                callback(err, doc);
            } else {
                callback(err, null);
            }
        });
    });
};