// dependencies
var express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var flash = require("connect-flash");
var session = require("express-session")
var app = express();
app.set('views', __dirname + '../explorer/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
passport.use(
  "local",
  new LocalStrategy(function (username, password, done) {
    var user = {
      id: "1",
      username: "admin",
      password: "admin"
    };
    if (username !== user.username) {
      return done(null, false, {
        message: "Incorrect username."
      });
    }
    if (password !== user.password) {
      return done(null, false, {
        message: "Incorrect password."
      });
    }

    return done(null, user);
  })
);

passport.serializeUser(function (user, done) {
  //保存user对象
  done(null, user); //可以通过数据库方式操作
});

passport.deserializeUser(function (user, done) {
  //删除user对象
  done(null, user); //可以通过数据库方式操作
});

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Express'
  });
});
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/test',
    failureRedirect: '/'
  }));

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
app.get("/test", (req, res) => {
  res.end("test is ok!");
});
app.all("/api/*", isLoggedIn);
app.get('/api/one', (req, res) => {
  res.end('qpi one is ok!')
})

app.get('/api/two', (req, res) => {
  res.end('qpi two is ok!')
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.send(`没有权限`)
  }
}

app.listen(3000, () => {
  console.log(`open http://localhost:3000`);
});