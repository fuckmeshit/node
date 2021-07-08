var MongodbClient=require('mongodb').MongoClient;
// Connection url
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'microblog123';
function Post(username,post,time){
    this.user=username;
    this.post=post;
    if (time) {
        this.time=time;

    }else{
        this.time=new Date();
    }
};
module.exports=Post;
Post.prototype.save=function save(callback){
    //存入mongodb文档
    var post={
        user:this.user,
        post:this.post,
        time:this.time
    };
    MongodbClient.connect(url,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    },function(err,client){
        if (err) {
            throw err;
        }
        client.db(dbName).collection('posts').insertOne(post,function(err,res){
            if (err) {
                throw err;
            }
            console.log('文档插入成功')
            client.close();
            callback(err,post);
        });
    });
    
};
Post.get = function get(username, callback) {
    MongodbClient.connect(url, { useNewUrlParser: true,useUnifiedTopology: true }, function(err, db) {
        //首先读取集合中的内容
        let query={};
        if (username) {
            query.user=username
        }
        db.db(dbName).collection('posts').find(query).sort({time:-1}).toArray((function(err,docs){
            if (err) {
                callback(err, null);
                }
            db.close();
             // 封装 posts 为  Post 对象
             //这一步我不太看懂，回头再看看
            let posts=[];
            docs.forEach(function(doc,index){
                let post=new Post(doc.user, doc.post, doc.time);
                posts.push(post);
            });
            callback(null,posts);
        })
        );
    });
};