const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


// затребовать базу данных пользователей
const userDB = require('./userDB'); // затребовать './userDB
//console.log(userDB);

passport.serializeUser(function(user, done) {
    console.log('Сериализация: ', user.emails[0].value);
    done(null, user.emails[0].value);
  });  

  passport.deserializeUser(function(emails, done) {
    console.log('Десериализация: ', emails);    
    let user = false;
    for (let elem in userDB) {
      if ( userDB[elem].email === emails) {
        user = userDB[elem];
        break;
      };
    };

    done(null, user);
  });

  // аутентификация  
passport.use(
  new GoogleStrategy(
      {
          clientID: '415263593664-c6dbtciunuj96eh63t5vca3iu94a3cjr.apps.googleusercontent.com', //YOUR GOOGLE_CLIENT_ID 
          clientSecret: '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', //YOUR GOOGLE_CLIENT_SECRET 
          callbackURL:
              'http://localhost:7002/auth/google/callback', //http://localhost:7001/auth/google/callback
      },
      function (accessToken, refreshToken, params, profile, done) {
        // Now that we have user's `profile` as seen by VK, we can (Теперь, когда у нас есть "профиль" пользователя, видимый в VK, мы можем)
        // use it to find corresponding database records on our side. (использовать его для поиска соответствующих записей базы данных на нашей стороне)
        // Also we have user's `params` that contains email address (if set in scope), token lifetime, etc. (Также у нас есть "параметры" пользователя, 
        // которые содержат адрес электронной почты, если задан в scope, срок службы токена и т.д.) 
        // Here, we have a hypothetical `User` class which does what it says. (Здесь у нас есть гипотетический класс "User", который делает то, что он говорит.)
        //*
        let profileUser = false; 

        for (let elem in userDB) {
          if ( userDB[elem].email === profile.emails[0].value) {
            profileUser = profile;
            break;
          };
        };
        console.log(profile);
        return done(null, profileUser);
      }      
  )
);

  