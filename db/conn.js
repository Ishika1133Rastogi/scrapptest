const mongoose = require("mongoose");
// require('../Link');
require('../calling')
mongoose.set('strictQuery', false);
const DB = process.env.DATABASE;

  try {
     mongoose.connect(DB);
    console.log(`✅ Connected to database`);
  } catch (error) {
    console.log(`❌ Error connecting to database: ${DB}`, error);
  }



  //DYNAMIC DATABASE

  const { MongoClient } = require('mongodb');


const client = new MongoClient(DB, { useNewUrlParser: true, useUnifiedTopology: true });

async function createDynamicCollection(databaseName, collectionName) {
  try {
    await client.connect();
    const database = client.db(databaseName);

    // Create the collection with the specified name
    await database.createCollection(collectionName);
    console.log(`Collection '${collectionName}' created successfully`);
  } catch (error) {
    console.error('Error creating collection:', error);
  } finally {
    await client.close();
  }
}

// Example usage with user input
const userInput = 'example.com';
const collectionName = userInput.replace(/[^\w\s]/gi, ''); // Remove non-alphanumeric characters
createDynamicCollection('webScraper', collectionName);


// module.exports = connectToDatabase;

// const connect = async () => {
//     try {
//         await mongoose.connect('mongodb+srv://ishikarastogi57:teena@cluster0.8xhkhkk.mongodb.net/webScraper?retryWrites=true&w=majority&appName=Cluster0');
//         console.log("✅ db connected");
//     } catch (err) {
//         console.log("❌ db connection failed", error);
//     }
//     mongoose.connection.on("disconnected", () => { console.log("❌ db disconnected"); });
//     mongoose.connection.on("reconnected", () => { console.log("✅ db reconnected"); });
// }
 
// export default { connect };




// Example usage of the createNewCollection function


// Note: This is just an example. You should use proper user input validation and sanitization before creating new collections.
