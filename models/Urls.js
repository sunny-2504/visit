const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UrlsSchema = new Schema({
    userid : {type:String, required:true},
    furl : {type:String, required:true},
    code : {type:String, required:true},
    unique:{type:Number, default:0},
    total:{type:Number, default:0}
}, 
{
    versionKey:false
}
)

const Urls = mongoose.model('Urls', UrlsSchema);

module.exports = Urls;