const Express = require('express');
const router = Express.Router();
const Urls = require('../models/Urls');
const device = require('express-device');
const visitors = require('../models/visitors');
const Mapping = require('../models/Mapping');
router.use(device.capture())
const geoip = require('geoip-lite')
var Sniffr = require('sniffr');
var jwt = require('jsonwebtoken');

router.get('/:scode', async (req, res) => {
    try {
      const code = req.params.scode
      const url = await Mapping.find({code : code}).sort({$natural:-1}).limit(1)
      console.log(url[0].furl)


      if (url) {
        const urlid = url[0].campaign;
        console.log('urlid', urlid)
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
            if(url[0].utms){
            return res.redirect(`${url[0].furl}`+`?utm_source=${url[0].utms.utm_source}`+`&utm_medium=${url[0].utms.utm_medium}`+`&utm_campaign=${url[0].utms.utm_campaign}`)}
            else
            {
              return res.redirect(`${url[0].furl}`)
            }
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
        if(url[0].utms){
        return res.redirect(`${url[0].furl}`+`?utm_source=${url[0].utms.utm_source}`+`&utm_medium=${url[0].utms.utm_medium}`+`&utm_campaign=${url[0].utms.utm_campaign}`);}
        else
        {
          return res.redirect(`${url[0].furl}`)

        }
      }
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
      const condition = {
        "urlid" : code,
        "createdAt": {'$gte': new Date('2022/07'), '$lte':  Date.now()},
        }
        visitors.find(condition, function(err, response){
            
            if (!err){
                let unique = [...new Set(response.map(item => item.ip))];
                
                res.json({
                    "total" : response.length,
                    "unique" : unique.length,
                    "desktop" : response.filter(x => x.device === 'desktop').length,
                    "mobile" : response.filter(x => x.device === 'phone').length,
                    "wos" : response.filter(x => x.os === 'windows').length,
                    "oos" : response.filter(x => x.os !== 'windows').length,
                });
            }
        });
    
      
    } catch (error) {
      console.log(error)
      
    }
  })

  //get request to get latest two visitor
  router.get('/recent/latestVisitors', async (req, res) => {
    const token = req.headers['x-access-token'];
    try {
      const decoded = jwt.verify(token, 'optisoftjwtsecretforloginasdfqwerty')
      const userid = decoded.userid

      const url = await Mapping.find({userid:userid})

      const urlid = url.map(x => x.campaign)

      const condition = {
        "urlid" : {$in : urlid},
        }
      const list = await visitors.find(condition).sort({createdAt: -1}).limit(2)
      res.json(list)
    } catch (error) {
      console.log(error)
    
    }
  })









  module.exports = router;
