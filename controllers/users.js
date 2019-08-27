const router = require('express').Router();
const db = require('../models');


router.get('/:id', (req,res)=>{
  db.users.findByPk(rq.params.id)
  .then((user)=>{
    res.render('users/show', { user: user});
  });
});


router.get('/:id/delete', (req,res)=>{
  db.users.findByPk(req.params.id).then((user)=>{
  res.render('users/delete', {user: user});
  });
});
router.delete('/:id/delete', (req,res)=>{
  db.users.destroy({where : {id: req.params.id }}).then(()=>{
    res.send('THAT SHIT IS GONE');  
  });
});


router.get('/:id/edit', (req,res)=>{
  db.users.findByPk(req.params.id)
  .then((user)=>{
    res.render('users/edit', {user: user})
  });
});
router.put('/:id/edit', (req,res)=>{
  db.users.update({
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


router.get('/new', (req,res)=>{
  res.render('users/new');
});
router.post('/new', (req,res)=>{
  db.recipes.create({
    name: req.body.name,
    email: req.body.email
  })
  .then(()=>{
    res.redirect(`/users/${req.params.id}`)
  });
});


module.exports = router;