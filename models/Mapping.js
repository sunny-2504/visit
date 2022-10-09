const mongoose = require('mongoose');
const mappingSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    urlid: {
        type: String,
        required: true
    },
    code : {
        type : String,
        required : true
    },
    furl: {
        type: String,
        required: true
    },
    campaign: {
        type: String,
        required: true
    },
    campaignName : {type:String, default:''},
    utms : {type:Object, default:{
        utm_source : '',
        utm_medium : '',
        utm_campaign : '',
    }},
})
const Mapping = mongoose.model('Mapping', mappingSchema);
module.exports = Mapping