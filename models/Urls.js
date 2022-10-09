const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UrlsSchema = new Schema({
    UrlType : {type : String, required:true},
    userid : {type:String, required:true},
    furl : {type:String, required:true},
    code : {type:String, required:true},
    domain : {type:String, required : true},
    unique:{type:Number, default:0},
    total:{type:Number, default:0},
    type: {type:String, default:'Static', required:true},
    styling : {type : Object, default : {
        "background" : "#ffffff",
        "color" :   {"colorEye" : "#000000",
                     "colorEyeBall" : "#000000",
                     "colorDot1" : "#000000",
                     "colorDot2" : "#000000",},
        "eye" : "square",
        "eyeBall" : "square",
        "dp" : "square",
        "logo" : ""       
    }},
}, 
{
    versionKey:false
}
)

const Urls = mongoose.model('Urls', UrlsSchema);

module.exports = Urls;