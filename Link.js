const mongoose = require('mongoose');
const linkSchema = new mongoose.Schema({
    url: { type: String, required: true, unique:true},
    children: [
        {  
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Link_data'  
    }
    ]
});
const Link_data= mongoose.model('Link_data', linkSchema);
module.exports = Link_data;






