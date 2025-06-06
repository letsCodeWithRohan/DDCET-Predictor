const express = require("express")
const app = express()
const dataModel = require("../models/merit")
const connectDB = require("../config/connectDB")
const dotenv = require("dotenv")
const serverless = require("serverless-http");
const path = require('path');
const ejs = require("ejs");
const chromium = require("chrome-aws-lambda");
const puppeteer = require('puppeteer-core');
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

// Route to download pdf
app.get("/download-pdf", async (req, res) => {
  try {
    const { instituteType, admissionCategory, branch, rank } = req.query;
    const mongoQuery = {};

    if (instituteType) mongoQuery.instituteType = instituteType;
    if (admissionCategory) mongoQuery.admissionCategory = admissionCategory;
    if (branch) mongoQuery.branch = branch;
    if (rank) mongoQuery.lastAdmittedDDCETRank = { $gte: parseInt(rank) };

    const colleges = await dataModel
      .find(mongoQuery)
      .sort("firstAdmittedDDCETRank instituteType -quota");

    const html = await ejs.renderFile(
      path.join(__dirname, "../views/download-pdf.ejs"),
      { colleges }
    );

    const browser = await puppeteer.launch({
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath,
  headless: chromium.headless,
});

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=colleges.pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "Failed to generate PDF", details: err.message });
  }
});

// Export as serverless function
module.exports = app;
module.exports.handler = serverless(app);