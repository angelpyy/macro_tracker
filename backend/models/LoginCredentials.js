const mongoose = require("mongoose");
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    }
}, {timestamps: true} )

const user = mongoose.model('user', userSchema)
module.exports = user