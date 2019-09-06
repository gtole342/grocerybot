const router = require('express').Router();
const passport = require('../config/passportConfig');
const isLoggedIn = require('../middleware/isLoggedIn');
const user = require('../models').user;

const getDeleteUserPage = (req,res) => {
  user.findByPk(req.user.id)
  .then((user)=>{
    res.render('user/delete', {user: user});
  });
};

const deleteUser = (req,res) => {
  user.destroy({
    where : {id: req.user.id }
  })
  .then(()=>{
    req.logout();
    res.redirect('/');  
  });
};

const getEditUserPage = (req,res) =>{
  user.findByPk(req.user.id)
  .then((user)=>{
    res.render('user/edit', {user: user});
  });
};

const editUser = (req,res) =>{
  user.update({
    where: {id: req.user.id},
    fields: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }
  })
  .then(()=>{
    res.redirect('/user')
  });
};

const getSignupPage = (req,res) => {
  res.render('user/new');
};

const createUser = (req,res,next) => {
  user.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  })
  .spread((user, wasCreated)=>{
    if(wasCreated) {
      passport.authenticate('local', {
        successRedirect: '/user',
        successFlash: 'Successful sign up. Welcome!',
        failureRedirect: '/user/login',
        failureFlash: 'This should never happen. Contact your administrator.'
      })(req, res, next);
    }
    else {
      req.flash('error', 'Account already exists. Please log in!');
      res.redirect('/user/login');
    }
  })
  .catch(err => {
    console.log('Error in POST /user/signup', err);
    req.flash('error', 'Something went awry!');
    if(err && err.errors){
      err.errors.forEach(e => {
        if(err.type === 'Validation error'){
          req.flash('error', 'Validation issue -' + e.message);
        }
      });
    }
    res.redirect('/user/signup');
  })
};

const getLoginPage = (req,res) => {
  res.render('user/login');
}

const passportAuth = passport.authenticate('local', {
  successRedirect: '/user',
  successFlash: 'Log in succesful',
  failureRedirect: '/user/login',
  failureFlash: 'Invalid Credentials'
});

const logoutUser = (req,res) => {
    req.logout();
    req.flash('success', 'Log out successful');
    res.redirect('/');
};

const getUserPage = (req,res) => {
  res.render('user/show', {user: req.user});
};


router.get('/delete', getDeleteUserPage);
router.delete('/', deleteUser);
router.get('/edit', getEditUserPage);
router.put('/edit', editUser);
router.get('/signup', getSignupPage);
router.post('/signup', createUser);
router.get('/login', getLoginPage);
router.post('/login', passportAuth);
router.get('/logout', logoutUser);
router.get('/', isLoggedIn, getUserPage);


module.exports = router;