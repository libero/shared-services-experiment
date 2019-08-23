const fetch = require("node-fetch");

const restClient = function(url) {
    const uploadFile = async function (namespace, directory, filename, file, contentType, metaData) {
        let headers = {
            "Content-Type": contentType,
            "If-Match": "<etag_value>|*",
        };
        if (metaData) {
            headers = { ...headers, "Libero-file-tags": metaData}
        }
        try {
            const response = await fetch(`${url}/files/${namespace}/${directory}/${filename}`, {
                method: 'POST',
                body: file,
                headers: headers
            });

            return await response.json();
        }
        catch (error) {
            throw new Error(`Request error: ${error.toString()}`)
        }
    };

    const fetchFile = async function (namespace, directory, filename) {
        try {
            const response = await fetch(`${url}/files/${namespace}/${directory}/${filename}`);
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

    const fetchMetaData = async function (namespace, directory, filename) {
        try {
            const response = await fetch(`${url}/files/${namespace}/${directory}/${filename}`, {
                method: 'HEAD'
            });
            const tags = response.headers.get('Libero-file-tags');
            const link = response.headers.get('Link');
            const lastModified = response.headers.get('Last-Modified');
            const contentType = response.headers.get('Content-Type');

            return {
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

    return {
        uploadFile,
        fetchFile,
        fetchMetaData,
    }
};

module.exports = restClient;