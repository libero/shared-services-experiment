const fetch = require("node-fetch");
const {ApolloClient} = require('apollo-client');
const {InMemoryCache} = require('apollo-cache-inmemory');
const {HttpLink} = require('apollo-link-http');
const gql = require('graphql-tag');

const graphqlClient = function (url) {
    const cache = new InMemoryCache();
    const link = new HttpLink({
        uri: url,
        fetch: fetch
    });
    const client = new ApolloClient({
        cache,
        link
    });

    const getFileMetaData = async function (key) {
        let metaData;
        await client.query({
            query: gql`
                query GetFileMeta($key: String) {
                    getFileMeta(key: $key) {
                        updated,
                        size,
                        publicLink,
                        tags,
                        mimeType,
                        namespace
                    }
                }
            `,
            variables: {
                key: key,
            }
        }).then(result => metaData = result);

        return metaData;
    };

    const uploadFile = async function (namespace, directory, filename, file, tags) {
        const fileMetaInput = {
            key: `${directory}/${filename}`,
            namespace: namespace,
        };
        let metaData;

        let mutation = gql`
            mutation UploadFile($file: Upload, $meta: FileMeta) {
                uploadFile(file: $file, meta: $meta) {
                    key,
                    updated,
                    size,
                    publicLink,
                    tags,
                    mimeType,
                    namespace
                }
            }
        `;

        await client.mutate({
            variable: {
                file: file,
                meta: fileMetaInput,
            },
            mutation: mutation
        }).then(result => metaData = result);

        return metaData;
    };

    const fetchFile = async function (namespace, directory, filename) {
        try {
            const response = await fetch(`${url}/rest/files/${namespace}/${directory}/${filename}`);
            const tags = response.headers.get('Libero-file-tags');
            const link = response.headers.get('Link');
            const lastModified = response.headers.get('Last-Modified');
            const contentType = response.headers.get('Content-Type');
            const file = await response.body;

            return {
                file,
                tags,
                link,
                lastModified,
                contentType,
            };
        }
        catch (error) {
            throw new Error(`Request error: ${error.toString()}`)
        }
    };

    return {uploadFile, getFileMetaData, fetchFile}
};

module.exports = graphqlClient;
