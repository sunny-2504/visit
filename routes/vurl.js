const Express = require('express');
const router = Express.Router();
const Urls = require('../models/Urls');
const device = require('express-device');
const visitors = require('../models/visitors');
router.use(device.capture())
const geoip = require('geoip-lite')

router.get('/:scode', async (req, res) => {
    try {
      const code = req.params.scode
      const url = await Urls.findOne({ code: req.params.scode });


      if (url) {
        const urlid = url._id;
        // const ip = req.headers['http-x-forwarded-for'] || req.connection.remoteAddress;
        const ip ='117.99.164.238'
        const visitor = await visitors.findOne({ip: ip})
        const device = req.device.type;
        const city = geoip.lookup(ip).city;
        const country = geoip.lookup(ip).country;
        // console.log(visitor.ip)
        if(visitor)
        {
            await Urls.findOneAndUpdate({code : code}, {$inc : {'total' : 1}})
            await visitors.create({
              urlid,
              ip,
              device,
              city,
              country
            })
            console.log('from if')
            return res.json(url.furl);
        }
        else {
        
         await visitors.create({
          urlid,
          ip,
          device,
          city,
          country
        })
          await Urls.findOneAndUpdate({code : code},{$inc : {'unique' : 1, 'total' : 1}})
        
        console.log('from else')
        return res.json(url.furl);}
      } 
      
      else res.status(404).json('Not found');


    } 
    
    catch (err) {
      console.log(err);
      res.status(500).json('Server Error');
    }
  });

  router.get('/statics/:code', async (req, res) => {
    try {
      const code = req.params.code
      const url = await Urls.findOne({code:code})
      console.log(url)
      if(url){
        res.json({"unique": url.unique, "total" : url.total})
      }
      
    } catch (error) {
      console.log(error)
      
    }
  })






  module.exports = router;
