const mongoose = require('mongoose'); 


const admin = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
})

const admincred = mongoose.model("AdminID", admin);
