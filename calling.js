const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const scrap = require('./scraper1');
const mongoose = require('mongoose');
const pdf = require('html-pdf');
const Json2csvParser = require('json2csv').Parser;
const axios = require('axios')
app.use(cors());
const request = require('request-promise');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
PORT = process.env.PORT||5002;
const DB = process.env.DATABASE;
app.use(bodyParser.json());
const fs = require('fs');
const { URL } = require('url');
const cheerio = require('cheerio');
 
 
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*")
  res.header('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if(req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET')
      return res.status(200).json({h:"11"});
  }
  next();
})
//DATABASE
 
try {
  mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });Date
 console.log(`✅ Connected to database`);
} catch (error) {
 console.log(`❌ Error connecting to database: ${DB}`, error);
}
 
 
// Define a schema for the scraped data
const scrapedDataSchema = new mongoose.Schema({
  url: String,
  isChecked: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});
 
// Define a schema for the base URL and its scraped data
const baseSchema = new mongoose.Schema({
  BASE_URL: {
    type: String,
    unique: true
  },
  scrapedData: [scrapedDataSchema]
});
const Base  = mongoose.model('Base', baseSchema);

const updateScrapedDataItem = async (itemId, isChecked) => {
  try {
    const result = await Base.findOneAndUpdate(
      { "scrapedData._id": itemId },
      { $set: { "scrapedData.$.isChecked": isChecked, "scrapedData.$.timestamp": isChecked ? Date.now() : null } },
      { new: true }
    );
    // console.log("Updated document:", result);
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

  app.get('/api/search', async (req, res) => {
    const baseUrl = req.query.BASE_URL;
  
    try {
      let doc = await Base.findOne({ BASE_URL: baseUrl });
      if (!doc) {
        fs.readFile('output.txt', 'utf8', async (err, data) => {
          if (err) {
            console.error('Error reading output file:', err);
            return res.status(500).json({ error: 'Error reading output file' });
          }
          const urls = data.split('\n').filter(Boolean);
  
          // Extract the first URL as BASE_URL
          const BASE_URL = urls.shift().trim();
          // Create a new document with BASE_URL and scrapedData
          const newBase = new Base({
            BASE_URL,
            scrapedData: urls.map(url => ({ url: url.trim() }))
          });
          // Save the new document to MongoDB
          try {
            await newBase.save();
            console.log('Data saved to MongoDB');
            return res.status(200).json(newBase); // Return the newly created document
          } catch (error) {
            console.error('Error saving data to MongoDB:', error);
            return res.status(500).json({ error: 'Error saving data to MongoDB' });
          }
        });
      } else {
        return res.status(200).json(doc); // Return the existing document
      }
    } catch (error) {
      console.error('Error searching for document:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });


//SCRAPER API CALL FOR FIRST STEP
app.post('/scrape', async (req, res) => {
  const { url } = req.body;
  console.log(url);
  if (!url) {
      return res.status(400).json({ error: 'URL is required' });
  }
  try {
      const visitedUrls = new Set();
       fs.readFileSync('output.txt', '');
      fs.writeFileSync('output.txt', '');
      const urls2 = await scrap(url, null, new URL(url), visitedUrls);
      return res.status(200).json({ urls2 });
  } catch (error) {
      console.error('Error scraping UR2L:', url, error);
      return res.status(500).json({ error: 'An error occurred while scraping URL' });
  }
});

let urls ;
//API HIT FOR MONGO DB DATABASE FOR TRUE VALUE
app.put('/api/update-ischecked', async (req, res) => {
  // urls =[]
  const url = req.body.url;
  const id = req.body.id;
  const isChecked = req.body.isChecked;
  const urlsArray = req.body.urlsArray;
  urls= urlsArray;
 
  try {
    updateScrapedDataItem(id, isChecked);
    res.status(200).json({
      "success":"123"
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
 

let selectors = []; // Store user-entered selectors

// Endpoint to receive user-entered selectors
app.post('/scrapes', (req, res) => {
  const { selector } = req.body;
  selectors.push(selector);
  res.json({ message: 'Selector added successfully' });
});
 
// Utility function to scrape data from a URL using a selector
async function scrapeData(url, selector) {
  try {
    const response = await axios.get(url);
    let pages = [];
    const $ = cheerio.load(response.data);
    let pageData = {};
    selector.forEach((selector) => {
      let values = [];
      $(selector).each((index, element) => {
        values.push($(element).text().trim());
      });
      pageData[selector] = values;
    });
   
    pages.push(pageData);
    return pages;
 
  } catch (error) {
    console.error('Error scraping URL:', url, error);
    return null;
  }
}

app.post('/scrape-data', async (req, res) => {
 
  if (!urls.length || !selectors.length) {
    return res.status(400).json({ error: 'No URLs or selectors found' });
  }
 
  const scrapedData = [];
  for (let i = 0; i < urls.length && i < selectors.length; i++) {
    const url = urls[i];
    const selector = selectors[i];
    const data = await scrapeData(url, selector);
    if (data) {
      scrapedData.push({ url, data });
    }
  }
 
  // Write scraped data to a file
  const output = scrapedData.map(({ url, data }) => `${url}: ${JSON.stringify(data)}`).join('\n');
fs.writeFileSync('text.txt', output, 'utf-8');
 
  res.json({ message: 'Scraping completed successfully', data: scrapedData });
});
 
// Example usage: pass the path to your text file
    app.listen(PORT, () => {
      console.log('Server running on port 5002');
    });
