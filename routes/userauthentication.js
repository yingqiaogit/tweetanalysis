/**
 * Created by a on 6/10/2015.
 */

var express = require('express');

var router = express.Router();

router.get('/api', function(req, res, next){
    res.send('twitter user authentication with /authentication?account={twitter_account}');

});

router.post('/authentication',function(req,res,next){


});

module.exports = router;



