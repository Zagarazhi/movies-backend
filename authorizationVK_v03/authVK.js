const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);// хранение в файле сессий
const passport = require('passport');


const app = express();

//https://oauth.vk.com/authorize?client_id=51621729&display=page&redirect_uri=http://localhost:7001/auth/vkontakte/callback&scope=email&response_type=code&v=5.131

const port = process.env.port || 7001;
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
      maxAge: 60 * 60 * 1000, // время действия авторизации (1ч)
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
  '/auth/vkontakte',
  passport.authenticate('vkontakte', {
    scope: ['email', 'profile'],
  })
);

app.get(
  '/auth/vkontakte/callback',
  passport.authenticate('vkontakte', {
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



  

  



  