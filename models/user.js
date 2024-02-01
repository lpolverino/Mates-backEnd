const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username:{ type: String, required: true },
    password:{ type: String, required: true },
    email:{ type: String },
    description :{ type: String },
    date_of_birth:{type: Date},
    date_account_creation:{type: Date},
    friends:[],
    groups:[],
})

UserSchema.virtual("url").get(function (){
    return `/user/${this._id}`;
})


module.exports = mongoose.model("User", UserSchema);