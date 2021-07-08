var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var bodyParser=require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var session=require('express-session');
const MongoStore = require('connect-mongo')(session);
var flash=require('connect-flash')
var settings=require('./settings');
var mysql=require('mysql');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//设置session
app.use(session({
  secret: settings.cookieSecret, //加密
  store: new MongoStore({
    url: 'mongodb://localhost/' + settings.db,
    autoRemove: 'native' 
  })
  }));
  app.use(flash());
//设置flash，这步要在路由之前

//req.flash到底是什么
//以下部分的use的呢日哦那个不太理解，这里需要后期回顾一下
//为什么这个部分可以用来对导航条进行判断操作，不是很理解
//这里实际上是app.dynamicHelpers()方法的替代操作
app.use(function(req,res,next){
  res.locals.user=req.session.user;

  var err = req.flash('error');
  var success = req.flash('success');

  res.locals.error = err.length ? err : null;
  res.locals.success = success.length ? success : null;
   
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//下面应该是自己添加的，但是不知道为啥添加在这里，忘了
//Express支持定义视图助手，本质其实就是给所有视图注册了全局变量，因此无需每次在调用模板引擎时传递数据对象
app.use(function(req, res, next){
  res.locals.inspect = function(obj) {
      return util.inspect(obj, true);
  };
  res.locals.headers = req.headers;
  res.locals.user = req.session.user;
  let error = req.flash('error');
  res.locals.error = error.length ? error : null;
  let success = req.flash('success');
  res.locals.success = success.length ? success : null;
  next();
});

module.exports = app;
