var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
// var rewrite = require('express-urlrewrite');

var sessionStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var profileRouter = require('./routes/profile');
var loginRouter = require('./routes/login');
var mypageRouter = require('./routes/mypage');
var myblogRouter = require('./routes/myblog');
var logoutRouter = require('./routes/logout');
var bloglistRouter = require('./routes/bloglist');
var chatroomRouter = require('./routes/chatroom');
var composeRouter = require('./routes/compose');
var updblogRouter = require('./routes/updblog');
var delblogRouter = require('./routes/delblog');
var hideblogRouter = require('./routes/hideblog');
var blogdetailRouter = require('./routes/blogdetail');
var commentRouter = require('./routes/comment');
var uploadimgRouter = require('./routes/uploadImg');
var uploadvideoRouter = require('./routes/uploadVideo');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3030);

var ejs = require('ejs'); 

//session
app.use(session({
  secret: 'fir-djr',
  name: 'session-id',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60  * 24,
  },
  rolling: true,
  store: new sessionStore({
    url: 'mongodb://localhost/session',
    touchAfter: 1 * 3600,
  })
}));

// app.use(rewrite(/^\/space/, '/myblog/$1'));

app.use(function(req, res, next){ 

  // //single user switch
  // req.session.login = '1';

  if(req.url.includes('.js') || req.url.includes('.css') || req.url.includes('.png') || req.url.includes('.jpg')){

    next();
  }

  else{
    //session赋值
    res.locals.session = req.session;
    
    let arr = req.url.split("/");    

    //访问博客
    if(req.url.includes("/space")){

      let blogname = arr[2];
      // console.log(blogname);
      req.session.blogname = blogname;
      res.redirect('/myblog?blogname=' + blogname);
    }else if(req.url.includes("/comment") || req.url.includes("/myblog") || req.url.includes("/blogdetail")){
      
      next();  
    }else{
    
      if(req.session.login === '1'){   

        next();
      } else{

        for(var i=0, length=arr.length; i<length; i++){

          arr[i] = arr[i].split("?")[0];
        }

        if(!(arr.length>=2 && arr[0]=='' && (arr[1]=='register' || arr[1]=='login' || arr[1]==''))){

          res.redirect('/login');
        } else{

          next();
        }

      }
    }
  }
});



// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/profile', profileRouter);
app.use('/login', loginRouter);
app.use('/mypage', mypageRouter);
app.use('/myblog', myblogRouter);
app.use('/logout', logoutRouter);
app.use('/bloglist', bloglistRouter);
app.use('/chatroom', chatroomRouter);
app.use('/compose', composeRouter);
app.use('/updblog', updblogRouter);
app.use('/delblog', delblogRouter);
app.use('/hideblog', hideblogRouter);
app.use('/blogdetail', blogdetailRouter);
app.use('/comment', commentRouter);
app.use('/uploadImg', uploadimgRouter);
app.use('/uploadvideo', uploadvideoRouter);

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


// Chatroom

//起始用户人数为0
var userCnt = 0;

io.on('connection', (socket) => {
  var addedUser = false;

  // when the client emits 'new ', this listens and executes
  //监听用户的新消息，有就发布在屏幕上
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {

    if (addedUser) {
      return;//如果用户已添加，不做任何操作返回
    }

    // we store the username in the socket session for this client
    //添加用户名以及人数
    socket.username = username;
    ++userCnt;
    //设置已添加FLG
    addedUser = true;
    socket.emit('login', {
      userCnt: userCnt
    });

    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      userCnt: userCnt
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --userCnt;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        userCnt: userCnt
      });
    }
  });
});

module.exports = app;
