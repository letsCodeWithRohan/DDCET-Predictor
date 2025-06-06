const mongoose = require("mongoose")

const connectDB = () => {
    mongoose.connect(`${process.env.MONGODB_LOCAL}`)
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log("Error : ",err))
}

module.exports = connectDB;