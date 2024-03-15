// const express = require('express');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const Link = require('./Link');  
// const app = express();
// const cors = require('cors');
// const urlModule = require('url');

// app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// PORT =5000;

// async function scrap(url, parent = null, baseUrl) {
//     try {
//       const response = await axios.get(url);
//       const $ = cheerio.load(response.data);
//       const base = urlModule.parse(url);
  
//       const urls = [];
  
//       $('a').each((index, element) => {
//         const href = $(element).attr('href');
//         if (href) {
//           const absoluteUrl = urlModule.resolve(base.href, href);
//           const absoluteUrlParsed = urlModule.parse(absoluteUrl);
//           if (absoluteUrlParsed.hostname === baseUrl) {
//             urls.push(absoluteUrl);
//           }
//         }
//       });
   
//       const savedUrls = [];
//       for (const u of urls) {
//         const existingLink = await Link.findOne({ url: u });
//         if (!existingLink) {
//           const link = new Link({ url: u });
//           if (parent) {
//             link.children.push(parent);
//           }
//           await link.save();
//           savedUrls.push(link);
//         }
//       }
//     for (const savedUrl of savedUrls) {
//       await scrap(savedUrl.url, savedUrl._id, baseUrl);
//     }
//   } catch (error) {
//     console.error('Error scraping URL:', url, error);
//   }
// }

// module.exports = scrap
// .........................................................previous 
// const express = require('express');
// const axios = require('axios');
// const cheerio = require('cheerio'); 
// const puppeteer = require('puppeteer');
// const app = express();
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const fs = require('fs'); 
// require('dotenv').config(); 
// app.use(cors()); 
// app.use(express.urlencoded({ extended: true })); 
// app.use(express.json()); 
// PORT = process.env.PORT||5002; 
// app.use(bodyParser.json()); 
// app.use(cors()) 

// const { URL } = require('url');


// async function scrap(url, parent = null, baseUrl, visitedUrls) {
//   try {
//       if (visitedUrls.has(url)) {
//         //   console.log(`URL already visited: ${url}`);
//           return;
//       }

//       visitedUrls.add(url);
//       const absoluteUrl = new URL(url, baseUrl);

//       fs.appendFileSync('output.txt', absoluteUrl.href + '\n');

//       const response = await axios.get(absoluteUrl.href);
//       const $ = cheerio.load(response.data);

//       $('a').each((index, element) => {
//           const href = $(element).attr('href');
//           if (href) {
//               const childUrl = new URL(href, absoluteUrl);
//               if (childUrl.hostname === baseUrl.hostname) {
//                   scrap(childUrl.href, absoluteUrl.href, baseUrl, visitedUrls);
//               }
//           }
//       });
//   } catch (error) {
//       console.error('Error scraping URL:',error);
//   }
// }

// const express = require('express');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const Link = require('./Link');  
// const app = express();
// const cors = require('cors');
// const urlModule = require('url');

// app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// PORT =5000;

// async function scrap(url, parent = null, baseUrl) {
//     try {
//       const response = await axios.get(url);
//       const $ = cheerio.load(response.data);
//       const base = urlModule.parse(url);
  
//       const urls = [];
  
//       $('a').each((index, element) => {
//         const href = $(element).attr('href');
//         if (href) {
//           const absoluteUrl = urlModule.resolve(base.href, href);
//           const absoluteUrlParsed = urlModule.parse(absoluteUrl);
//           if (absoluteUrlParsed.hostname === baseUrl) {
//             urls.push(absoluteUrl);
//           }
//         }
//       });
   
//       const savedUrls = [];
//       for (const u of urls) {
//         const existingLink = await Link.findOne({ url: u });
//         if (!existingLink) {
//           const link = new Link({ url: u });
//           if (parent) {
//             link.children.push(parent);
//           }
//           await link.save();
//           savedUrls.push(link);
//         }
//       }
//     for (const savedUrl of savedUrls) {
//       await scrap(savedUrl.url, savedUrl._id, baseUrl);
//     }
//   } catch (error) {
//     console.error('Error scraping URL:', url, error);
//   }
// }

// module.exports = scrap
// .........................................................previous 
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio'); 
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs'); 
require('dotenv').config(); 
app.use(cors()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
PORT =5002; 
app.use(bodyParser.json()); 
app.use(cors()) 

const { URL } = require('url');

async function scrap(url, parent = null, baseUrl, visitedUrls) {
  try {
      if (visitedUrls.has(url)) {
          return [];
      }

      visitedUrls.add(url);
      const absoluteUrl = new URL(url, baseUrl);
      fs.appendFileSync('output.txt', absoluteUrl.href + '\n');

      const response = await axios.get(absoluteUrl.href);
    //   console.log(response)
      const $ = cheerio.load(response.data);

      const childUrls = [];
      $('a').each(async(index, element) => {
          const href = $(element).attr('href');
          if (href) {
              const childUrl = new URL(href, absoluteUrl);
              if (childUrl.hostname === baseUrl.hostname) {
                 childUrls.push(childUrl.href);
                await scrap(childUrl.href, absoluteUrl.href, baseUrl, visitedUrls);
              }
          }
      });
      // return childUrls;
      return childUrls;
  } catch (error) {
    return [];
      // console.error('Error scraping URL123:', error);
  }
}
module.exports = scrap


