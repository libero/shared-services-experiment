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
            const response = await fetch(`${url}/${namespace}/${directory}/${filename}`, {
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

    return {
        uploadFile
    }
};

module.exports = restClient;