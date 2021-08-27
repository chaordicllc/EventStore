const aws = require('aws-sdk')

const endPointUrl = 'nyc3.digitaloceanspaces.com'
const spacesEndpoint = new aws.Endpoint(endPointUrl);
const s3 = new aws.S3({
  endpoint: spacesEndpoint
});
const bucketName = 'chaordic1'

exports.Endpoint = s3
exports.bucketName = bucketName