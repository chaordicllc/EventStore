// Load dependencies
const aws = require('aws-sdk');
const express = require('express');
const MegaHash = require('megahash');
const { Mutex } = require('async-mutex');

const app = express();

app.use(express.json())

const mutex = new Mutex();

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint
});

var nextIdsHash = new MegaHash();

var putEvent = function(typeId, eventJson) {

    var params = {
      Bucket: 'chaordic1',
      Key: determineEventFileName(typeId, eventJson),
      Body: JSON.stringify(eventJson),
      ContentType: "application/json"
    };

    mutex
    .acquire()
    .then(function(release) {

      var putObjectPromise = s3.putObject(params).promise();
      putObjectPromise.then(function(data) {
        console.log("Successfully uploaded data to " + params.Bucket + "/" + params.Key);
      }).catch(err => {
        console.log(err) 
      }).finally(() => {
        incrementNextId(typeId)
        release()
      });

    });
}

var determineEventFileName = function(typeId, eventJson) {
    return typeId + '_' + eventJson.Action + '_' + getNextId(typeId) //uuid.generate() + '_' + eventJson.Object
}

var getNextId = function(typeId) {

  var existingNextIdValue
  existingNextIdValue = nextIdsHash.get(typeId)
  if (existingNextIdValue === undefined) {
    existingNextIdValue = 1
  }
  console.log(nextIdsHash)

  return existingNextIdValue
}

var incrementNextId = function(typeId) {

  var existingNextIdValue
  existingNextIdValue = nextIdsHash.get(typeId)
  if (existingNextIdValue === undefined) {
    existingNextIdValue = 1
  }
  console.log(nextIdsHash)

  existingNextIdValue++
  nextIdsHash.set(typeId, existingNextIdValue)
}

app.post('/events', function (request, response, next) {
    console.log(request.body)
    var typeId = request.body.Type
    putEvent(typeId, request.body)
    response.send()
});

app.get('/eventTypes/:typeId', function (request, response, next) {
  console.log(request.query)
  response.send(getNextId())
});

app.listen(3001, function () {
  console.log('Server listening on port 3001.');
});