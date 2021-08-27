const routes = require('express').Router()

const s3 = require('../Components/s3')
const uuid = require('short-uuid')
const { Mutex } = require('async-mutex')
const nextId = require('../Components/nextId')

// Global objects
const mutex = new Mutex();

routes.post('/', function (request, response, next) {
    console.log(request.body)
    var typeId = request.body.Type
    putEvent(typeId, request.body)
      .then(function(data) {
        response.send(data)
      })
      .catch(err => {
          console.log(err)
        response.sendStatus(err)
      })
});

routes.get('/:eventId', function (request, response, next) {
    console.log(request.params.eventId)

    getEvent(request.params.eventId)
      .then(function(data) {
        response.send(data)
      })
      .catch(err => {
        response.sendStatus(err)
      })
});

// Internal functions
var getEvent = function(eventId) {

    return new Promise((resolve, reject) => {

      var params = {
          Bucket: s3.bucketName,
          Key: eventId
      }
          
      s3.Endpoint.getObject(params, function(err, data) {
          if (err) {
              console.log(err)
              reject(err.statusCode)
          } else {
              console.log(data)
              resolve(data.Body)
          }
      });
   });
}

var putEvent = function(typeId, eventJson) {

    return new Promise((resolve, reject) => {

      var params = {
        Bucket: s3.bucketName,
        Key: determineEventFileName(typeId, eventJson),
        Body: JSON.stringify(eventJson),
        ContentType: "application/json"
      };
  
      mutex
      .acquire()
      .then(function(release) {
  
        var putObjectPromise = s3.Endpoint.putObject(params).promise();
        putObjectPromise
          .then(function(data) {
            console.log("Successfully uploaded data to " + params.Bucket + "/" + params.Key)
            resolve("Successfully uploaded data to " + params.Bucket + "/" + params.Key)
          })
          .catch(err => {
            console.log(err) 
            reject(err.statusCode)
          })
          .finally(() => {
            nextId.incrementNextId(typeId)
            release()
          });
  
      });
    })
}

var determineEventFileName = function(typeId, eventJson) {
    return typeId + '/' + uuid.generate() + '/Event' + nextId.getNextId(typeId) //uuid.generate() + '_' + eventJson.Object
}

module.exports = routes