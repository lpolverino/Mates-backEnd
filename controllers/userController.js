const User = require("../models/user")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
var bcrypt = require('bcryptjs');


exports.user_list = asyncHandler(async (req, res, next) => {
    res.status(200).json({message:"congrats"});
});

exports.user_detail = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author list");
});

exports.create_user = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author list");
});

exports.update_user = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author list");
});

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
      return res.status(400).json({error:errors.array()})
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
                return res.status(200).json({message:"Sing Up correctly"});
              } catch(err) {
                return next(err);
              };
          });
    }
})
]