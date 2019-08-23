const restClient = require('./clients/restClient');
const graphqlClient = require('./clients/graphqlClient');
const {createReadStream} = require('fs');
describe('client tests', () => {
    describe('rest client', () => {
        it('should instantiate with a url and provide three functions', () => {
            let client = new restClient('url');
            expect(client).toHaveProperty('fetchFile');
            expect(client).toHaveProperty('fetchMetaData');
            expect(client).toHaveProperty('uploadFile');
        });

        it('should upload a file', async () => {
            let client = new restClient('http://localhost:3000');
            expect(await client.uploadFile(
                'test',
                'somedir',
                'testFile.bar',
                createReadStream('testFile.txt'),
                'application/text',
                'sometag=somevalue',
            )).not.toThrow();
        });

        it('should retrieve a file', async () => {
            let client = new restClient('http://localhost:3000');
            const {file} = await client.uploadFile(
                'test',
                'somedir',
                'testFile.bar',
                createReadStream('testFile.txt'),
                'application/text',
                'sometag=somevalue',
            );
            expect(file.length).toBeGreaterThan(0);
        });

        it('should retrieve the meta data', async () => {
            let client = new restClient('http://localhost:3000');
            const {
                tags,
                link,
                lastModified,
                contentType,
            } = await client.uploadFile(
                'test',
                'somedir',
                'testFile.bar',
                createReadStream('testFile.txt'),
                'application/text',
                'sometag=somevalue',
            );
            expect(tags).toBe('sometag=somevalue');
            expect(link).not.toBeNull();
            expect(lastModified).not.toBeNull();
            expect(contentType).toBe('application/text');
        })
    });

    describe('graphql client', () => {
        it('should instantiate with a url and provide three functions', () => {
            let client = new graphqlClient('http://localhost:3000/graphql/');
            expect(client).toHaveProperty('getFileMetaData');
            expect(client).toHaveProperty('uploadFile');
        });

        it('should upload a file', async () => {
            let client = new graphqlClient('http://localhost:3000/graphql/');
            let file;
            await client.uploadFile('test', 'somedir', 'testFile.bar', createReadStream('testFile.txt'), 'sometag=somevalue').then(result => file = result);
            expect(file.length).toBeGreaterThan(0);
        });

        it('should retrieve a file', async () => {
        });

        it('should retrieve the meta data', async () => {
            let client = new graphqlClient('http://localhost:3000/graphql/');
            await client.getFileMetaData('blah');
        });
    });

});