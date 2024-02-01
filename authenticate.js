const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user")
var bcrypt = require('bcryptjs');


const strategy = new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username }).exec();
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        };
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" })
        }
        return done(null, user);
      } catch(err) {
        return done(err);
    };
})

const verifyToken = (req,res,next) =>{
  const bearerHeader = req.headers['authorization']
  if(typeof bearerHeader !== 'undefined'){
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1]
    req.token = bearerToken;
    next()
  } else{
    res.status(403).json({message:"Invalid Authorizations Header"})
  }
}
exports.verifyToken = verifyToken

exports.local_strategy = strategy