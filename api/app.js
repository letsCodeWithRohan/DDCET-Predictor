const express = require("express")
const app = express()
const dataModel = require("../models/merit")
const connectDB = require("../config/connectDB")
const dotenv = require("dotenv")
const serverless = require("serverless-http");
dotenv.config()

let port = process.env.PORT || 3000

connectDB()

app.set("view engine","ejs")
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/",async  (req, res) => {
    let branches = await dataModel.distinct("branch");
    let categories = await dataModel.distinct("admissionCategory");
    res.render("home",{branches,categories})
})

app.get("/getall", async (req, res) => {
    let allClgs = await dataModel.find()
    res.render("colleges", { colleges : allClgs})
})

app.get("/filter",async (req,res) => {
    let {instituteType, admissionCategory, branch} = req.query;
    let userRank = req.query.rank;

    let mongoQuery = {}

    if(instituteType){
        mongoQuery.instituteType = instituteType;
    }
    if(admissionCategory){
        mongoQuery.admissionCategory = admissionCategory;
    }
    if(branch){
        mongoQuery.branch = branch;
    }
    if(userRank){
        let parsedRank = parseInt(userRank);
        mongoQuery.lastAdmittedDDCETRank = { $gte: parsedRank };
    }
    try{
        let results = await dataModel.find(mongoQuery).sort("firstAdmittedDDCETRank instituteType -quota")
        res.render("colleges", {colleges :results})
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

// app.listen(port, () => console.log(`Server running at localhost:${port}`))

// Export as serverless function
module.exports = app;
module.exports.handler = serverless(app);