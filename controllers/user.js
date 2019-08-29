const router = require('express').Router();
const passport = require('../config/passportConfig');
const isLoggedIn = require('../middleware/isLoggedIn');
const user = require('../models').user;


router.get('/delete', (req,res)=>{
  user.findByPk(currentUser.id).then((user)=>{
    res.render('user/delete', {user: user});
  });
});
router.delete('/delete', (req,res)=>{
  user.destroy({
    where : {id: req.params.id }
  })
  .then(()=>{
    res.redirect('/');  
  });
});


router.get('/edit', (req,res)=>{
  user.findByPk(req.params.id)
  .then((user)=>{
    res.render('user/edit', {user: user})
  });
});
router.put('/edit', (req,res)=>{
  user.update({
    where: {id: req.params.id},
    fields: {
      name: req.body.name,
      email: req.body.email
    }
  })
  .then(()=>{
    res.redirect(`/user/${req.params.id}`)
  });
});


router.get('/signup', (req,res)=>{
  res.render('user/new');
});
router.post('/signup', (req,res)=>{
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
        successRedirect: '/profile',
        successFlash: 'Successful sign up. Welcome!',
        failureRedirect: '/auth/login',
        failureFlash: 'This should never happen. Contact your administrator.'
      })(req, res, next);
    }
    else {
      req.flash('error', 'Account already exists. Please log in!');
      res.redirect('/auth/login');
    }
  })
  .catch(err => {
    console.log('Error in POST /auth/signup', err);
    req.flash('error', 'Something went awry!');
    if(err && err.errors){
      err.errors.forEach(e => {
        if(err.type === 'Validation error'){
          req.flash('error', 'Validation issue -' + e.message);
        }
      });
    }
    res.redirect('/auth/singup');
  })
  .then(()=>{
    res.redirect(`/user`);
  });
});

router.get('/login', (req,res)=>{
  res.render('user/login')
});
router.post('/login', passport.authenticate('local', {
  successRedirect: '/user',
  successFlash: 'Log in succesful',
  failureRedirect: '/user/login',
  failureFlash: 'Invalid Credentials'
}));

router.get('/logout', (req,res)=>{
  req.logout();
  req.flash('success', 'Log out successful');
  res.redirect('/');
});

router.get('/', isLoggedIn, (req,res)=>{
  res.render('user/show')
});


module.exports = router;