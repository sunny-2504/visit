const Express = require('express');
const router = Express.Router();
const Urls = require('../models/Urls');
const device = require('express-device');
const visitors = require('../models/visitors');
router.use(device.capture())
const geoip = require('geoip-lite')
var Sniffr = require('sniffr');

router.get('/:scode', async (req, res) => {
    try {
      const code = req.params.scode
      const url = await Urls.findOne({ code: req.params.scode });


      if (url) {
        const urlid = url._id;
        // const ip = req.headers['http-x-forwarded-for'] || req.connection.remoteAddress;
        const header = req.headers['user-agent'];
        const ip ='117.99.164.238'
        const visitor = await visitors.findOne({ip: ip, urlid : urlid})
        const device = req.device.type;
        const city = geoip.lookup(ip).city; 
        const country = geoip.lookup(ip).country;
        const sniffr = new Sniffr();
        sniffr.sniff(header);
        const os = sniffr.os.name;
        console.log(os) 

        // console.log(visitor.ip)
        if(visitor)
        {
            await Urls.findOneAndUpdate({code : code}, {$inc : {'total' : 1}})
            await visitors.create({
              urlid,
              ip,
              device,
              city,
              country,
              os
            })
            console.log('from if')
            return res.redirect(`//${url.furl}`);
        }
        else {
        
         await visitors.create({
          urlid,
          ip,
          device,
          city,
          country,
          os
        })
          await Urls.findOneAndUpdate({code : code},{$inc : {'unique' : 1, 'total' : 1}})
        
        console.log('from else')
        return res.redirect(`//${url.furl}`);}
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
      const condition = {
        "urlid" : url._id,
        "createdAt": {'$gte': new Date('2022/07'), '$lte':  Date.now()},
        }
        visitors.find(condition, function(err, response){
            
            if (!err){
                let unique = [...new Set(response.map(item => item.ip))];
                
                res.json({
                    "total" : response.length,
                    "unique" : unique.length,
                    "desktop" : response.filter(x => x.device === 'desktop').length,
                    "mobile" : response.filter(x => x.device === 'phone').length 
                });
            }
        });
    
      
    } catch (error) {
      console.log(error)
      
    }
  })

  //get request to get latest two visitor
  router.post('/latestVisitors', async (req, res) => {
    try {
      const userid = req.body.userid
      const url = await Urls.find({userid:userid})
      const urlid = url.map(x => x._id)
      const condition = {
        "urlid" : {$in : urlid},
        }
      const visitors = await visitors.find(condition).sort({createdAt: -1}).limit(2)
      res.json(visitors)
    } catch (error) {
      console.log(error)
    
    }
  })









  module.exports = router;
