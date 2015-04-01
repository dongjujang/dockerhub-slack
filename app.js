var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var raven = require('raven');
var request = require('request');
var port = process.env.PORT || 8888;
var url = process.env.WEBHOOK_URL || '';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(raven.middleware.express(process.env.SENTRY_DSN || ''));

app.get('/*', function(req, res){

  throw new Error('Broke!');
  res.send(Error);
});

app.post('/post', function(req, res){
  if (!req.body || !url) {
    res.status(500).json('');
    return;
  }

  res.json('');

//  JSON.stringify(req.body, null, 4);
//  var result = JSON.stringify(req.body, null, "\t");
  var result = "[" + req.body.repo_name + "] " + "Dockerfile built by " + req.body.pusher + "\n" + req.body.repo_url

  var options = {
    text: result,
    username: 'dockerhub build bot'
  };
  var requestParams = {
    url: url,
    body: JSON.stringify(options)
  };
  request.post(requestParams, function(err,res,body) {
    console.log(req.body)
  });
});

app.listen(port);