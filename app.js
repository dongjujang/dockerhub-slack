var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var raven = require('raven');
var request = require('request');
var port = process.env.PORT || 8888;
var url = process.env.WEBHOOK_URL || '';
var sentry = process.env.SENTRY_DSN || '';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(raven.middleware.express(sentry));

app.get('/*', function(req, res){
  res.send('');
});

app.post('/post', function(req, res){
  if (!req.body || !url || !sentry) {
    res.status(500).json('');
    return;
  }

  res.json('');

  var result = "[" + req.body.repository.repo_name + "] " + req.body.repository.name + " built by " + req.body.push_data.pusher + "\n" + req.body.repository.repo_url
  var options = {
    text: result,
    username: 'dockerhub build bot'
  };
  var requestParams = {
    url: url,
    body: JSON.stringify(options)
  };
  request.post(requestParams, function(err, res, body) {
    console.log(req.body)
  });

  var requestCallback = {
    url: req.body.callback_url,
    body: req.body
  };
  request.post(requestCallback, function(err, res, body) {
  });
});

app.listen(port);