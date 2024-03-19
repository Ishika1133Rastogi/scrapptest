/*const express = require('express');
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
  const isChecked = req.body.isChecked;
  // console.log("url is checked", url);
  // console.log("is checked", isChecked)
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
*/
    //...............................................perfect


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
    console.log("Updated document:", result);
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

//API HIT FOR MONGO DB DATABASE FOR TRUE VALUE
app.put('/api/update-ischecked', async (req, res) => {
  const url = req.body.url;
  const id = req.body.id;
  console.log("checked Url is 123 ", url, "id is", id)
  const isChecked = req.body.isChecked;
  try {
    updateScrapedDataItem(id, isChecked);
    res.status(200).json({
      "success":"123"
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
 

// Define the API endpoint
app.get('/api/get-checked-urls/:id', async (req, res) => {
  try {
    const id=req.params.id;
    const user = await Base.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
0
    // Filter the scrapedData array to get URLs where isChecked is true
    const checkedUrls = user.scrapedData.filter(data => data.isChecked).map(data => data.url);
    res.json(checkedUrls);
  } catch (error) {
    console.error('Error fetching checked URLs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// app.get('/api/get-checked-urls', async (req, res) => {
 
//   try {
 
//       const urls = await Base.find({ isChecked: true }, 'url');
//       res.json({ urls });
//   } catch (error) {
//       console.error('Error fetching checked URLs:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.get('/api/get-checked-urls', async (req, res) => {
//   try {
//     const checkedUrls = await Base.find({ isChecked: true });
//     res.json(checkedUrls);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
 
let urls = []; // Store URLs received from API
let selectors = []; // Store user-entered selectors
 
// Utility function to fetch URLs from '/api/get-urls' API
 
async function getUrls() {
  try {
    const response = await axios.get('http://localhost:5002/api/get-checked-urls');
    urls = response.data.map((item) => item.url);
    console.log("checked url is:" , urls)
  } catch (error) {
    console.error('Error fetching URLs:', error);
  }
}
 
// Endpoint to receive user-entered selectors
app.post('/scrapes', (req, res) => {
  const { selector } = req.body;
  console.log(selector)
  selectors.push(selector);
  console.log("selectors", selectors);
  res.json({ message: 'Selector added successfully' });
});
 
// Utility function to scrape data from a URL using a selector
async function scrapeData(url, selector) {
  try {
    const response = await axios.get(url);
    // console.log("scrapedat response", response);
    let pages = [];
    const $ = cheerio.load(response.data);
    // console.log("$", $)
    let pageData = {};
    selector.forEach((selector) => {
      let values = [];
      $(selector).each((index, element) => {
        values.push($(element).text().trim());
      });
      pageData[selector] = values;
    });
    // const scrapedData = $(selector).text().trim();
    console.log("pagedata", pageData)
    pages.push(pageData);
    console.log("pages", pages)
    return pages;
 
  } catch (error) {
    console.error('Error scraping URL:', url, error);
    return null;
  }
}
 
 
app.post('/scrape-data', async (req, res) => {
  await getUrls();
console.log("url lrn", urls.length, "selector len ", selectors.length)
  if (!urls.length || !selectors.length) {
    return res.status(400).json({ error: 'No URLs or selectors found' });
  }
 
  const scrapedData = [];
  // console.log("loop url", url, "loop selector", selector)
  for (let i = 0; i < urls.length && i < selectors.length; i++) {
    const url = urls[i];
    const selector = selectors[i];
    console.log("loop url", url, "loop selector", selector)
    const data = await scrapeData(url, selector);
    // console.log("data 123", data);
    if (data) {
      scrapedData.push({ url, data });
      console.log("scrapeData123", data)
    }
  }
 
  // Write scraped data to a file
  const output = scrapedData.map(({ url, data }) => `${url}: ${JSON.stringify(data)}`).join('\n');
console.log("output", output)
fs.writeFileSync('text.txt', output, 'utf-8');
 
  res.json({ message: 'Scraping completed successfully', data: scrapedData });
});
 
// Define the schema
const quoteSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  data: [{
    selector: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }]
});
 
// Create a model from the schema
const Quote = mongoose.model('Quote', quoteSchema);
 
// Connect to MongoDB
mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true });
 
 
function storeDataFromTextFile(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
 
    try {
      const jsonData = JSON.parse(data);
 
      // Iterate over each entry in the JSON data and insert into the database
      jsonData.forEach(entry => {
        const { url, data } = entry;
        const newQuote = new Quote({ url, data });
        newQuote.save()
          .then(() => {
            console.log(`Data for ${url} inserted successfully`);
          })
          .catch(err => {
            console.error(`Error inserting data for ${url}:`, err);
          });
      });
 
      mongoose.connection.close();
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });
}
 
// Example usage: pass the path to your text file
storeDataFromTextFile('text.txt');
 
 
// Example usage
 
 
 
// SCRAPES API CALL FOR SECOND PART
// app.post('/scrapes', async (req, res) => {
//   const {  selectors } = req.body;
//   const urls = await getUrls();
 
//   console.log("url is ", urls);
//   console.log("selector is:", selectors);
 
//   let pages = [];
 
//   for (let article of urls) {
//     const response = await request({
//       uri: article.trim(),
//       gzip: true,
//     });
 
//     let $ = cheerio.load(response);
 
//     let pageData = {};
 
//     selectors.forEach((selector) => {
//       let values = [];
//       $(selector).each((index, element) => {
//         values.push($(element).text().trim());
//       });
//       pageData[selector] = values;
//     });
//     pages.push(pageData);
//   }
//   fs.writeFileSync('./data.json', JSON.stringify(pages), 'utf-8');
 
//   const tableString = getTableString(pages);
//   const outputPath = './output2.txt';
//   fs.writeFileSync(outputPath, tableString, 'utf-8');
 
//   res.json({ tableString, pages });
 
//   const fields = selectors;
//   const json2csvParser = new Json2csvParser({ fields });
//   const csv = json2csvParser.parse(pages);
//   console.table(pages);
// });
 
// function getTableString(pages) {
//   let tableString = '';
//   pages.forEach((page) => {
//     for (let key in page) {
//       tableString += `\n ${key}: \n \n  ${page[key].join('\n')}\n`;
//     }
//     tableString += '\n'.repeat(3);
//   });
//   return tableString;
// }
    app.listen(PORT, () => {
      console.log('Server running on port 5002');
    });
