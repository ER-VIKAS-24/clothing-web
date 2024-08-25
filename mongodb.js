const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/login")
    .then(() => {
        console.log("mongodb connected");
    })
    .catch((err) => {
        console.error("failed to connect", err);
    });


const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        require: true
    },
    profilePicture: {
        type: Buffer
    }
})

const collection = new mongoose.model("LoginCollection", LoginSchema)

module.exports = collection