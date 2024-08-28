const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    macroTargets: {
        calories: {
            type: Number,
            default: 2000,
        },
        fats: {
            type: Number,
            default: 65,
        },
        carbs: {
            type: Number,
            default: 250,
        },
        protein: {
            type: Number,
            default: 150,
        },
    },
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model("User", UserSchema);