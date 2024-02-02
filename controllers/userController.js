const User = require("../models/user")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
var bcrypt = require('bcryptjs');


exports.user_list = asyncHandler(async (req, res, next) => {
    res.status(200).json({message:"congrats"});
});

exports.user_detail = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId
    const user = await User.findById(userId).select("-password").exec()
    if(user === null ){
        res.status(404).json({message:`the user: ${userId} not exists`, error:`user is null`})
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
    }

    return res.status(200).json({user:user})

});

exports.update_user =[
    body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("username should not be empty"),
    body("description")
    .trim()
    .isLength({ max: 500 })
    .withMessage("dexcription to long"),
    body("email")
    .trim()
    .isLength({ max: 100 })
    .withMessage("email too long")
    .isEmail()
    .withMessage("Invalid email address"),
    body("birth_date")
    .isISO8601()
    .toDate()
    .withMessage("INvalid Date")
    .custom(async birth_date => {
        const birt_Date_time = (new Date (birth_date)).getTime()
        const actual_time = (new Date()).getTime()
        if( birt_Date_time > actual_time){
            throw new Error("Invalid Birth Date")
        }
      }),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()){
            return res.status(400).json({message:"Invalid data provided", error:errors.array()})
        }
        const user = await User.findById(req.params.userId);

        if(user === null){
            return res.status(400).json({message:"user not exists", error:errors.array()})
        }

        console.log(req.body);

        const newUser = new User ({
            _id:user._id,
            password:user.password,
            date_account_creation: user.date_account_creation,
            username:req.body.username,
            description:req.body.description,
            email:req.body.email,
            date_of_birth: req.body.birth_date
        })


      const updatedUser = await User.findByIdAndUpdate(req.params.userId, newUser, {});
    
      return res.status(200).json({message:"updated correctly", user:req.params.userId})
    })    
] 
exports.delete_user = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author list");
});

exports.sing_up = [
    body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username is empty."),
    body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password is empty."),
  
asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      // Error messages can be returned in an array using `errors.array()`.
      return res.status(400).json({message:"Invalid data provided", error:errors.array()})
    } else {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            // if err, do something
            if(err){
                return next(err)
            }
            try {
                const user = new User({
                  username: req.body.username,
                  password: hashedPassword
                });
                const result = await user.save();
                return res.status(200).json({message:"Sing Up correctly",user:result._id});
              } catch(err) {
                return next(err);
              };
          });
    }
})
]