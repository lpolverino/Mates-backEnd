var express = require('express');
var router = express.Router();
const passport = require("passport");
require("dotenv").config()
const jwt = require("jsonwebtoken");
const authentications = require("../authenticate")

const userControler = require("../controllers/userController")

/* GET users listing. */

router.get('/', authentications.verifyToken,
  (req,res,next) => {
    jwt.verify(req.token, process.env.SECRET_P, (err, authData) => {
      if(err){
        return res.status(403).json({message:`Validation Fail`, error:err})
      }else{
       next() 
      }
    })
  },
 userControler.user_list);

router.get('/:userId',authentications.verifyToken, userControler.user_detail)

router.put('/:userId', authentications.verifyToken, userControler.update_user)

router.post('/log-in', function (req, res, next) {
  
  passport.authenticate('local', (err, user, info) => {
    console.log(`if error ${err}`);
    console.log(`user:${user}`);
    if (err || !user) {
        return res.status(400).json({
            message: 'Something is not right',
            error:err,
        });
    } 
    const token = jwt.sign({user}, process.env.SECRET_P);
    return res.json({token,user:user._id});
   
  })(req, res);
});

router.post('/sing-up', userControler.sing_up)

module.exports = router;
