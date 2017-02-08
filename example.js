//Example script for s3-list-all-objects

var listAllObjects = require('./index');

if (process.argv.length < 4 ) {
    console.log('Usage: node example.js <bucket-name> <prefix>');
    process.exit(1);
}

var bucket = process.argv[2], prefix = process.argv[3];
function getAllObjects() {
    console.log('\nGetting all objects when they\'re ready');

    listAllObjects({bucket:bucket}, function(err, data) {
        console.log('Got ' + data.length + ' objects, first object: ' + JSON.stringify(data[0]));
        getThingsBatched();
    });
}

function getThingsBatched() {
    console.log('\nNow getting things batched...');
    listAllObjects({bucket:bucket, progress: function(err, data) {
        console.log('Got batch ' + data.batchNr + ', isFinal: ' + data.finalBatch + ', object count: ' + data.data.length);
        if (data.finalBatch) {
            getPrefixedThings();
        }
    }});
}

function getPrefixedThings() {
    console.log('\nNow getting things with a prefix');
    listAllObjects({bucket:bucket, prefix:prefix}, function(err, data) {
        console.log('Got ' + data.length + ' prefixed objects, first object: ' + JSON.stringify(data[0]));
    });
}

getAllObjects();
