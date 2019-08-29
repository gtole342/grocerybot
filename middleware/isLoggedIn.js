module.exports = (req, res, next) => {
  if(req.user){
    next();
  }
  else {
    req.flash('error', 'You must be logged in to view this page.');
    res.redirect('/user/login');
  }
}