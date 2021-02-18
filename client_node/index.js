const restClient = require('./clients/restClient');
const graphqlClient = require('./clients/graphqlClient');
const { createReadStream } = require('fs');

const CONFIG_CLIENT = process.env.CONFIG_CLIENT || 'rest';
const CONFIG_URL = process.env.CONFIG_URL || 'http://localhost:42';

// let client = CONFIG_CLIENT === 'rest' ? restClient(CONFIG_URL) : graphqlClient(CONFIG_URL);
// let client = graphqlClient(CONFIG_URL);
let client = restClient(CONFIG_URL);

// GRAPHQL
// console.log('mutating');
// client.uploadFile('test', 'somedir', 'testFile.bar', createReadStream('testFile.txt'), 'sometag=somevalue')
//     .catch(error => console.error(error));
// client.getFileMetaData('blah');

// REST
client.uploadFile('test', 'somedir', 'testFile.bar', createReadStream('testFile.txt'), 'application/text', 'sometag=somevalue')
    .catch(error => console.error(error));

const {
    file,
    tags,
    link,
    lastModified,
    contentType,
} = client.fetchFile('test', 'somedir', 'testFile.bar');

const {
    tags,
    link,
    lastModified,
    contentType,
} = client.fetchMetaData('test', 'somedir', 'testFile.bar');


