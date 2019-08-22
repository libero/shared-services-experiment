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
        })
    };

    const uploadFile = async function (namespace, directory, filename, file, tags) {
        const fileMetaInput = {
            key: `${directory}/${filename}`,
            namespace: namespace,
        };
        console.log(JSON.stringify(fileMetaInput, null, 4));
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
        // console.log(mutation);
        await client.mutate({
            variable: {
                file: file,
                meta: fileMetaInput,
            },
            mutation: mutation
        });
        console.log('mutated')
    };

    return { uploadFile, getFileMetaData }
};

module.exports = graphqlClient;


// type FileMeta {
//     key: String!
//     updated: String!
//     size: Int!
//     sharedLink: String
//     publicLink: String
//     tags: [Tag]
//     mimeType: String!
//     namespace: String!
// }