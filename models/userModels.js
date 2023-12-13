const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        user_name: {
            type: String,
            required: [true, "user name is required"]
        },
        email: {
            type: String,
            required: [true, "email is required"]
        },
        password: {
            type: String,
            required: [true, "password is required"]
        },
        image: {
            type: String,
            require: false
        }
    },
    {
        timestamps: true
    }
)

// create model
const User = mongoose.model('User', userSchema);

module.exports = User;