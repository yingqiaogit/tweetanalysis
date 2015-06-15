/**
 * Created by a on 6/10/2015.
 */

var express = require('express');

var router = express.Router();

var oauth = require('oauth');

var OAuth2 = oauth.OAuth2;

var twitterConsumerKey = 'i1DJVo1bpMqlyQM7wMpnChE7L';

var twitterConsumerSecret = '9uqEcSwSjHGMHYhcmNc4yKd0VzMzz5hmJl5hTJ98qV53GfQjrc';

var accessToken;

router.get('/api', function(req, res, next){
    res.send('twitter user authentication with /authentication?account={twitter_account}');

});

router.get('api/appauth',function(req,res,next){

    var oauth2 = new OAuth2(
        twitterConsumerKey,
        twitterConsumerSecret,
        'https://api.twitter.com/',
        null,
        'oauth2/token',
        null);

    oauth2.getOAuthAccessToken(
        '',
        {'grant_type':'client_credentials'},
        function (e, access_token, refresh_token, results){
            console.log('bearer: ',access_token);
            oauth2.get('protected url',
                access_token, function(e,data,res) {
                    if (e) return callback(e, null);
                    if (res.statusCode!=200)
                        return callback(new Error(
                            'OAuth2 request failed: '+
                            res.statusCode),null);
                    try {
                        data = JSON.parse(data);
                    }
                    catch (e){
                        return callback(e, null);
                    }
                    return callback(e, data);
                });
            accessToken = access_token;
        });

});

module.exports = router;



