const mongoose = require("mongoose")

const connectDB = () => {
    mongoose.connect(`${process.env.MONGO_ALTAS_URI}`)
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log("Error : ",err))
}

module.exports = connectDB;