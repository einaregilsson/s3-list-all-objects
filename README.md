S3 List All Objects
===================

List all keys in a S3 bucket. Takes care of the annoying paging
so you don't have to.

## Installation

  `npm install s3-list-all-objects

## Usage

    var listAllObjects = require('s3-list-all-objects');

    // Get all objects together when they're ready
    listAllObjects({ bucket: 'yourbucketname'}, function(err, data) {
        console.log('Got ' + data.length + ' objects, first object: ' + JSON.stringify(data[0]));
    });

    // Get a callback with each page of objects as they come in
    listAllObjects({ bucket: 'yourbucketname, progress: function(err, data) {
        console.log('Got batch ' + data.batchNr + ', isFinal: ' + data.finalBatch + ', object count: ' + data.data.length);
    }});

    // Get prefixed objects
    listAllObjects({ bucket: 'yourbucketname, prefix : 'foldername/'}, function(err, data) {
        console.log('Got ' + data.length + ' objects with prefix.');
    });

The options parameter has the following keys:
    
    {
        bucket    : 'bucketname', **required** //Name of bucket to list objects from
        prefix    : 'foldername/', **optional** //Only get keys with this prefix
        progress  : function(err, data) { }, **optional** //Called when a page of keys is ready. data is { batchNr : <nr>, finalBatch: <true | false>, data : [keys]}
        s3options : {...} **optional** //Options that are passed directly to the S3 constructor in the AWS SDK. See their documentation for details.

    }
