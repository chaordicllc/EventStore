const routes = require('express').Router()
const nextId = require('../Components/nextId')
const s3 = require('../Components/s3')

// Route handlers
routes.get('/:eventType', function (request, response, next) {
    response.send('Hello')
});

routes.get('/:eventType/streams/:streamId', function (request, response, next) {
    
    listKeysForStream(request.params.eventType, request.params.streamId)
        .then(function(data) {
            response.send(data)
        })
        .catch(err => {
            response.sendStatus(err)
        })
})

var listKeysForStream = function(eventType, streamId) {

    return new Promise((resolve, reject) => {

        var params = {
            Bucket: s3.bucketName,
            Prefix: eventType + '/' + streamId
        }
            
        s3.Endpoint.listObjectsV2(params, function(err, data) {
            if (err) {
                console.log(err)
                reject(err.statusCode)
            } else {
                console.log(data)
                resolve(data.Contents)
            }
        });
     });
}

module.exports = routes