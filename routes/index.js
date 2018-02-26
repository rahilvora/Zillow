var express = require('express');
var router = express.Router();
var request = require('request');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/getHouses', function(req, res, next){
    var apiKey = "X1-ZWz1dyb53fdhjf_6jziz";
    var address = req.body.address.split(" ").join("+");
    var city = req.body.city.split(" ").join("+");
    var state = req.body.state.split(" ").join("+");
    var citystatezip = city + "+"+ state+"+"+ req.body.zipCode;
    var url = "http://www.zillow.com/webservice/GetSearchResults.htm?" +
        "zws-id="+apiKey+"&address="+address+"&citystatezip="+citystatezip;
    request(
        { method: 'GET'
            , uri: url
            , gzip: true
        }
        , function (error, response, body) {
            if(error){
                res.status(500).send({"data":error});
            }
            res.status(200).send({"data":body});
        }
    )
});
module.exports = router;
