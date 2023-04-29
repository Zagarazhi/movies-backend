const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);// хранение в файле сессий
const passport = require('passport');

const app = express();

const port = process.env.port || 7002;
// парсеры данных
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // true - если массивы

// параметры сессии
app.use(
  session({
    secret: 'you secret key',
    store: new FileStore(),
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // время действия авторизации (1ч, 1 мин)
    },
    resave: false,
    saveUninitialized: false,
  })
);

require('./config'); // затребовать './config'
app.use(passport.initialize()); // инициализация (активация) паспорта
app.use(passport.session()); // инициализация (активация) сессии

const auth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect('/login');
  }
};


app.get('/login', (req, res) => {
  res.send('Login page. Please, authorize.')
});

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/home',
  })
);

app.get('/home', auth, (req, res) => {
  res.send("Home page. You're authorized.")
});


app.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});



  

  



  