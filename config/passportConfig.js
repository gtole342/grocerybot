const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const user = require('../models').user;

passport.serializeUser((user, cb)=>{
  cb(null, user.id);
})

passport.deserializeUser((id, cb) =>{
  user.findByPk(id)
  .then(user =>{
    cb(null, user);
  })
  .catch(cb);
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (typedInEmail, typedInPassword, cb)=>{
  user.findOne({
    where: { email: typedInEmail }
  })
  .then(foundUser => {
    if(!foundUser || !foundUser.validPassword(typedInPassword)){
      cb(null, null);
    }
    else {
      cb(null, foundUser);
    }
  })
  .catch(cb);
}));

module.exports = passport;