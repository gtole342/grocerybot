const router = require('express').Router();
const user = require('../models').user;


router.get('/:id/delete', (req,res)=>{
  user.findByPk(req.params.id).then((user)=>{
  res.render('users/delete', {user: user});
  });
});
router.delete('/:id/delete', (req,res)=>{
  user.destroy({where : {id: req.params.id }}).then(()=>{
    res.send('THAT SHIT IS GONE');  
  });
});


router.get('/:id/edit', (req,res)=>{
  user.findByPk(req.params.id)
  .then((user)=>{
    res.render('users/edit', {user: user})
  });
});
router.put('/:id/edit', (req,res)=>{
  user.update({
    where: {id: req.params.id},
    fields: {
      name: req.body.name,
      email: req.body.email
    }
  })
  .then(()=>{
    res.redirect(`/users/${req.params.id}`)
  });
});


router.get('/signup', (req,res)=>{
  res.render('users/new');
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
    res.redirect(`/users`);
  });
});

router.get('/:id', (req,res)=>{
  user.findByPk(req.params.id)
  .then((user)=>{
    res.render('users/show', { user: user});
  });
});


module.exports = router;