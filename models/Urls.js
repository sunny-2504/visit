const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UrlsSchema = new Schema({
    furl : {type:String, required:true},
    code : {type:String, required:true}
}, 
{
    versionKey:false
}
)

const Urls = mongoose.model('Urls', UrlsSchema);

module.exports = Urls;