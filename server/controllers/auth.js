const User = require(`../models/user`);
const jwt = require(`jsonwebtoken`); // generate signed token
const expressjwt = require(`express-jwt`); //authorization check
const {errorHandler} = require(`../helpers/dbErrorHandler`);

exports.signup = (req,res) => {
    console.log("req.body", req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if(err){
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    });
};


exports.signin = (req, res) => {
  // find user via email
  const {email, password} = req.body;
  User.findOne({email}, (err, user) => {
      if(err || !user){
          return res.status(400).json({
              err: 'User with that email does not exist, please sign up'
          });
      }
      // if user is found, check that email matches password
      // create authentication method in user model
      if(!user.authenticate(password)) {
          return res.status(401).json({
              error: "email and password do not match"
          });
      }
      // generate a signed token with user id and secret

      const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
      // persist token as 't' in cookie with expiration date
      res.cookie('t', token, {expire: new Date() + 9999});
      // return response with user and token to frontend client
      const {_id, name, email, role} = user;
      return res.json({token, user: {_id, email, name, role}});
  })
};


exports.signout = (req, res) => {
  res.clearCookie('t');
  res.json({message: "signed out"});
};


exports.requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!user){
        return res.status(400).json({
            error: "Access denied"
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
  if(req.profile.role === 0){
      return res.status(403).json({
          error: "Admin only, access denied"
      });
  }
  next();
};
