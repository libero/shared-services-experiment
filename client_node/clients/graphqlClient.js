const fetch = require("node-fetch");
const { ApolloClient } = require('apollo-client');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { HttpLink } = require('apollo-link-http');
const gql = require('graphql-tag');

const graphqlClient = function(url) {
    const cache = new InMemoryCache();
    const link = new HttpLink({
        uri: url,
        fetch: fetch
    });
    const client = new ApolloClient({
        cache,
        link
    });

    const getFileMetaData = async function(key) {
        let metaData;
        await client.query({
            query: gql`
                query GetMetaData($key: String!) {
                    getFileMeta(key: $key) {
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
            mutation UploadFile($file: Upload!, $meta: FileMeta!) {
                uploadFile(file: $file, meta: $meta) {
                    id,
                    updated,
                    size,
                    internalLink,
                    sharedLink,
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

    return { uploadFile, getFileMetaData }
};

module.exports = graphqlClient;
