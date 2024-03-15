const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ishikarastogi57:teena123@cluster0.8xhkhkk.mongodb.net/webScraper?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

const UrlSchema = new mongoose.Schema({
  url: String,
  isChecked: { type: Boolean, default: false },
});

const Url2 = mongoose.model('Url2', UrlSchema);

const app = express();

app.use(bodyParser.json());

// Get all URLs
app.get('/urls', async (req, res) => {
  try {
    const urls = await Url2.find();
    res.json(urls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update URL isChecked value
app.put('/urls/:id', async (req, res) => {
  try {
    const url = await Url2.findById(req.params.id);
    url.isChecked = req.body.isChecked;
    await url.save();
    res.json(url);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add new URL
app.post('/urls', async (req, res) => {
  const url = new Url2({
    url: req.body.url,
  });

  try {
    const newUrl = await url.save();
    res.status(201).json(newUrl);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(5002, () => {
  console.log('Server running on port 5000');
});
