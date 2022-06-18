const Express = require('express');
const router = Express.Router();
const Urls = require('../models/Urls');
const device = require('express-device');
const visitors = require('../models/visitors');
router.use(device.capture())
const geoip = require('geoip-lite')
console.log(geoip.lookup('223.238.193.251').city);


router.get('/:scode', async (req, res) => {
    try {
      const url = await Urls.findOne({ code: req.params.scode });


      if (url) {
        const urlid = url._id;
        const ip = req.headers['http-x-forwarded-for'] || req.connection.remoteAddress;
        const device = req.device.type;
        const city = geoip.lookup(ip).city;
        const country = geoip.lookup(ip).country;
        

        const details = visitors({
          urlid,
          ip,
          device,
          city,
          country
        })

        await details.save();
        return res.json(url.furl);
      } 
      
      else res.status(404).json('Not found');


    } 
    
    catch (err) {
      console.log(err);
      res.status(500).json('Server Error');
    }
  });


  module.exports = router;
