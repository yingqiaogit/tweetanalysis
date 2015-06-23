/**
 * Created by a on 6/21/2015.
 */

var app = require('express');

var router = app.Router();

//the key of votetweetanalysis in twitter application management

var myConfig = {
    "consumerKey": "i1DJVo1bpMqlyQM7wMpnChE7L",
    "consumerSecret": "9uqEcSwSjHGMHYhcmNc4yKd0VzMzz5hmJl5hTJ98qV53GfQjrc",
    "accessToken": "1169193162-UeNkfKFILysCgCtdwVcicQHcFXYpruTwEGSSqSl",
    "accessTokenSecret": "ORjMtWDxSMxv20EPdhyrrTdvactY3x0OdRKANLrPkQBnd",
    "callBackUrl":"http://localhost:3000/signintwitter/step2"
};

router.oauthStore={};

var twitterLibrary = require('twitter-node-client');

var twitterHdl = new twitterLibrary.Twitter(myConfig);

router.get('/step1', function(req, res){
    console.log("the sign in button is pressed");

    //var signinUrl = 'https://api.twitter.com/oauth/authenticate?oauth_token=';
    var signinUrl ='https://api.twitter.com/oauth/authorize?oauth_token=';

    //retrieve the oauth request token
    twitterHdl.getOAuthRequestToken(function(oauth) {
        if(oauth != null){
            console.log(oauth);
            router.oauthStore[oauth.token] = oauth.token_secret;
            signinUrl = signinUrl + oauth.token;
            console.log('sign in url: ' + signinUrl);
            console.log('oauthStore: ' + JSON.stringify(router.oauthStore));
            res.redirect(signinUrl);
        }
        else{
            console.log("error on retrieving request token");
            res.status(500).send("error on retrieving request token");

        }
    });
});

router.get('/user/:username', function(req, res){

        var username = req.params.username;

        var user = twitterHdl.getUser({screen_name: username},function(error){
            res.status(500).send("error on retrieving user:" + username);
        }, function(body){
            console.log(body);
            res.send(body);

        });
    }

)

var getOAuthAccessToken = function (oauth, next) {
    twitterHdl.oauth.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
        function (error, oauth_access_token, oauth_access_token_secret, results) {
            if (error) {
                console.log('ERROR: ' + error);
                next();
            } else {
                oauth.access_token = oauth_access_token;
                oauth.access_token_secret = oauth_access_token_secret;

                console.log('oauth.token: ' + oauth.token);
                console.log('oauth.token_secret: ' + oauth.token_secret);
                console.log('oauth.access_token: ' + oauth.access_token);
                console.log('oauth.access_token_secret: ' + oauth.access_token_secret);
                next(oauth);
            }
        }
    );
};

router.get('/step2', function(req, res){
    var oauth_token = req.query.oauth_token;

    var oauth_verifier = req.query.oauth_verifier;

    console.log("you are at step 2 now");

    console.log("oauthStore: " + JSON.stringify(router.oauthStore));

    var oauthStep2 = {
        "token": oauth_token,
        "token_secret": router.oauthStore[oauth_token],
        "verifier": oauth_verifier
    }

    console.log("oauthStep2: " + JSON.stringify(oauthStep2));

    getOAuthAccessToken(oauthStep2,function(oauth){
        if (oauth == null){
            console.log("error on retrieving access token");
            res.status(500).send("error on retrieving request token");
        }
        else{
            router.oauthStore[oauth.access_token] = oauth.access_token_secret;
            console.log(router.oauthStore);
            delete router.oauthStore[oauth_token];
            console.log(JSON.stringify(router.oauthStore));
            res.redirect("/signintwitter/step3");
        }
    });

});


router.get('/step3', function(req,res){

    console.log("you are at step3 now");

    res.send("you are at step3 now")
});

module.exports= router;