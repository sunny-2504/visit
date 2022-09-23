const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const visitorsSchema = new Schema({
    urlid : {type:String, required:true},
    ip : {type:String, required:true},
    device : {type:String, required:true},
    city: {type:String, required:true},
    country:{type:String, required:true},
    os : {type:String, required:true},
    
}, 
{
    versionKey:false,
    timestamps: true
}
)

const visitors = mongoose.model('visitors', visitorsSchema);

module.exports = visitors;