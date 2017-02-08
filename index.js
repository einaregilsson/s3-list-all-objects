var AWS = require('aws-sdk');

function listAllObjects(options, callback) {
    var s3 = new AWS.S3(options.s3options || {});

    if (!options) {
        callback(new TypeError('Missing options parameter.'));
        return;
    }
    if (!options.progress && !callback) {
        callback(new TypeError('Either callback or options.progress must be a function.'));
        return;
    }
    if (!options.bucket) {
        callback(new TypeError('Missing options.bucket parameter.'));
        return;
    }

    var params = { Bucket: options.bucket };
    if (options.prefix) {
        params.Prefix = options.prefix;
    }

    var allFiles = [];

    var batchNr = 0;
    function load(){
        if (allFiles.length > 0){
            params.Marker = allFiles[allFiles.length-1].Key;
        }

        s3.listObjects(params, function(err, data) {
            if (err) {
                if (options.progress) {
                    options.progress(err, null);
                } 
                if (callback) {
                    return callback(err);
                }
                return;
            }

            allFiles.push.apply(allFiles, data.Contents);
            batchNr++;
            if (data.IsTruncated) {
                if (options.progress) {
                    options.progress(undefined, { batchNr : batchNr, finalBatch : false, data : data.Contents });
                }
                load();
            } else {
                if (options.progress) {
                    options.progress(undefined, { batchNr : batchNr, finalBatch : true, data : data.Contents });
                }
                if (callback) {
                    callback(undefined, allFiles);
                }
            }
        });
    }
    load();
}

module.exports = listAllObjects;