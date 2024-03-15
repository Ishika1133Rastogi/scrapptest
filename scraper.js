// const express = require('express');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const mongoose = require('mongoose');

// mongoose.connect('', {
// useNewUrlParser: true,
// useUnifiedTopology: true
// });
// const db = mongoose.connection;
// const linkSchema = new mongoose.Schema({
// url: { type: String, unique: true },
// title: String,
// description: String,
// children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Link' }]
// });
// const homepage = mongoose.model('homepage', linkSchema);

// const app = express();

// const scrapeAndStoreUrls = async (url) => {
// try {
// const response = await axios.get(url);
// const $ = cheerio.load(response.data);

// const uniqueLinks = new Set();
// $('a').each((index, element) => {
// const linkUrl = $(element).attr('href');
// if (linkUrl && !linkUrl.startsWith('#')) {
// uniqueLinks.add(linkUrl);
// }
// });

// const promises = [...uniqueLinks].map(async (linkUrl) => {
// try {
// const existingLink = await homepage.findOne({ url: linkUrl });
// if (!existingLink) {
// const newLink = new homepage({ url: linkUrl });
// await newLink.save();
// // console.log('Scraped and stored:', linkUrl);
// }
// } catch (error) {
// // console.error('Error saving link:', error);
// }
// });
// await Promise.all(promises);
// } catch (error) {
// // console.error('Error scraping page:', error);
// }
// };

// const scrapeDataFromStoredUrls = async () => {
// try {
// const storedLinks = await homepage.find({});
// console.log(storedLinks);
// for (const storedLink of storedLinks) {
// const { url } = storedLink;
// if (url !== mainUrl) {
// const response = await axios.get(url);
// const $ = cheerio.load(response.data);

// const title = $('title').text();
// const description = $('meta[name="description"]').attr('content');

// storedLink.title = title;
// storedLink.description = description;
// await storedLink.save();
// console.log('Scraped and updated:', url);
// }
// }
// } catch (error) {
// console.error('Error scraping data:', error);
// }
// };

// const mainUrl = 'https://quotes.toscrape.com/'; // Replace with your main URL
// scrapeAndStoreUrls(mainUrl);
// // Start scraping data from stored URLs
// scrapeDataFromStoredUrls();
// // Start the server
// const PORT = 3000;
// app.listen(PORT, () => {
// console.log(`Server is running on port ${PORT}`);
// });