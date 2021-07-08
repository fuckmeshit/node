const { Router } = require('express');
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var Post = require('../models/post');
var User=require('../models/user');

/* GET home page. */
router.get('/', function(req, res) {
  Post.get(null,function(err,posts){
    if(err){
      posts=[]
    }
    res.render('index', { title: '首页',
    posts:posts,
  
  });
  });
});
router.get('/reg', checkNotLogin);
router.get("/reg",function(req,res,next){
  res.render('reg',{title:'register'})
})
router.post('/reg', checkNotLogin);
router.post("/reg",function(req,res){
  if(req.body['rePassword']!=req.body['Password']){
    req.flash('error','两次密码不一致');
    return res.redirect('/reg')
  }
  var md5 = crypto.createHash('md5');//密码一致则进行加密
  var password = md5.update(req.body['Password']).digest('base64');
  //user对象内容还未进行设置
  var newUser = new User({
  name: req.body.user,
  password: password,
  });
  //检查用户名是否已经存在
  User.get(newUser.name, function(err, user) {
  if (user)
  err = 'Username already exists.';
  if (err) {
  req.flash('error', err);
  return res.redirect('/reg');
  }
  //如果不存在则新增用户
  newUser.save(function(err) {
  if (err) {
  req.flash('error', err);
  return res.redirect('/reg');
  }
  console.log('done it here?');
  req.session.user = newUser;
  req.flash('success', '注册成功');
  return res.redirect('/');
  });
  });
  });
router.get('/logout', checkLogin);
router.get('/logout', function(req, res) {
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
    });
router.get('/login', checkNotLogin);
router.get('/login', function(req, res) {
      res.render('login', {
      title: '用户登入',
      });
      });
router.post('/login', checkNotLogin);
router.post('/login',function(req,res){
  var md5=crypto.Hash('md5');
  var password=md5.update(req.body['Password']).digest('base64');
  var newUser=new User({
    name:req.body.user,
    password:password,
  });
    //检查用户名是否已经存在
    User.get(newUser.name, function(err, user) {
      console.log(password,user.password)
      if(!user){
        req.flash('error','用户不存在');
        return res.redirect('/login');
      }
      if (user.password!=password) {
        req.flash('error','用户口令错误');
        return res.redirect('/login');
        
      }
      req.session.user = user;
      req.flash('success', '登入成功');
      res.redirect('/');
      })
    });
    router.post('/post', checkLogin);
    router.post('/post', function(req, res) {
    var currentUser = req.session.user;
    var post = new Post(currentUser.name, req.body.post);
    post.save(function(err) {
    if (err) {
    req.flash('error', err);
    return res.redirect('/');
    }
    req.flash('success', '发表成功');
    res.redirect('/u/' + currentUser.name);
    });
    });
    router.get('/u/:user', function(req, res) {
      User.get(req.params.user, function(err, user) {
      if (!user) {
      req.flash('error', '用户不存在');
      return res.redirect('/');
      }
      Post.get(user.name, function(err, posts) {
      if (err) {
      req.flash('error', err);
      return res.redirect('/');
      }
      res.render('user', {
      title: user.name,
      posts: posts,
      });
      });
      });
      });
    function checkLogin(req, res, next) {
      if (!req.session.user) {
      req.flash('error', '未登入');
      return res.redirect('/login');
      }
      next();
      }
      function checkNotLogin(req, res, next) {
      if (req.session.user) {
      req.flash('error', '已登入');
      return res.redirect('/');
      }
      next();
      }
    

module.exports = router;
