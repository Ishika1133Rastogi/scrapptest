const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); 
const scrap = require('./scraper1');
const mongoose = require('mongoose');
// require('./db/conn')
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



//DATABASE

try {
  mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
 console.log(`✅ Connected to database`);
} catch (error) {
 console.log(`❌ Error connecting to database: ${DB}`, error);
}


const urlSchema = new mongoose.Schema({
  url: String,
  isChecked: { type: Boolean, default: false },
});
const Url21 = mongoose.model('Url21', urlSchema);



// const urlSchema = new mongoose.Schema({
// Main_url: {
//   type: String,
//   required: true,
// },
// urls: [{
//   url: {
//     type: String,
//     required: true,
//   },
//   isChecked: {
//     type: Boolean,
//     default: false,
//   },
// }],
// });


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
      // console.log("urls2",urls2)
      return res.status(200).json({ urls2 });
  } catch (error) {
      console.error('Error scraping UR2L:', url, error);
      return res.status(500).json({ error: 'An error occurred while scraping URL' });
  }
});


  function storedata(){
fs.readFile('output.txt', 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading output file:', err);
    return;
  }
  const urls = data.split('\n');
  // console.log(urls.length)
  // Save each line as a new document in MongoDB
  for (const line of urls) {
    try {
      
      const newData = new Url21({ url: line });
      await newData.save();
      // console.log('Saved:', line);
    } catch (error) {
      console.error('Error saving data to MongoDB:', error);
    }
  }
});
  }

 
//STORE JSON DATA AT /URLS FROM OUTPUT.TXT FILE

app.get('/urls', async(req, res) => {
  try {
    // console.log("00")
      const data = fs.readFileSync('output.txt', 'utf8');
      const urls = data.split('\n').filter(Boolean); // Filter out empty lines
     console.log(urls.length)
      res.status(200).json({ urls });
       storedata()
  } catch (error) {
      console.error('Error reading output file:', error);
      res.status(500).json({ error: 'An error occurred while reading the output file' });
  }
});


//API HIT FOR MONGO DB DATABASE FOR TRUE VALUE 
app.put('/api/update-ischecked', async (req, res) => {
  const url = req.body.url;
  console.log("checked url",url);
  const isChecked = req.body.isChecked;
  console.log("url is checked", url);
  console.log("is checked", isChecked)
  try {
    const updatedUrl = await Url21.findOneAndUpdate({ url }, { isChecked }, { new: true });
    res.json(updatedUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/get-checked-urls', async (req, res) => {
  try {
    const checkedUrls = await Url21.find({ isChecked: true });
    res.json(checkedUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// SCRAPES API CALL FOR SECOND PART
app.post('/scrapes', async (req, res) => {
  const { urls, selectors } = req.body;
  let pages = [];

  for (let article of urls) {
    const response = await request({
      uri: article.trim(),
      gzip: true,
    });

    let $ = cheerio.load(response);

    let pageData = {};

    selectors.forEach((selector) => {
      let values = [];
      $(selector).each((index, element) => {
        values.push($(element).text().trim());
      });
      pageData[selector] = values;
    });

    pages.push(pageData);
  }
   

  fs.writeFileSync('./data.json', JSON.stringify(pages), 'utf-8');

  const tableString = getTableString(pages);
  const outputPath = './output2.txt';
  fs.writeFileSync(outputPath, tableString, 'utf-8');

  res.json({ tableString, pages });

  const fields = selectors;
  const json2csvParser = new Json2csvParser({ fields });
  const csv = json2csvParser.parse(pages);
  console.table(pages);
});

function getTableString(pages) {
  let tableString = '';
  pages.forEach((page) => {
    for (let key in page) {
      tableString += `\n ${key}: \n \n  ${page[key].join('\n')}\n`; 
    }
    tableString += '\n'.repeat(3);
  });
  return tableString;
}
    app.listen(PORT, () => { 
      console.log('Server running on port 5002'); 
    });