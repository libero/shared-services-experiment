// Controller (Use-cases)
const { fileMetaRepo, fileDataRepo } = require('./repositories');
const { UserInputError } = require('apollo-server-express');

// Get the file from S3
async function getFileMeta(db_connection, key) {
  const out = await fileMetaRepo.get(db_connection, key);
  return out.getOrElseL(() => {throw new UserInputError("file not found")});
}

async function uploadFile(file, fileData) {
  const { stream, filename, mimetype, encoding } = await file;

  let fileSize = 0;

  const fileContent = await new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => {
      fileSize += chunk.length;
      chunks.push(chunk);
    });
    stream.on('error', () => { 
      console.error(`Error reading stream for file: ${fileData.id}`, err);
      reject();
    });
    stream.on('end', () => {
      resolve(Buffer.concat(chunks))
    });
  })

  // store file
  await fileDataRepo.putFile(fileContent, fileData);

  // store meta
  const newFile = {
    id: undefined,
    key: fileData.key,
    // How are we generating this? It might be a cdn link? config.publicPrefix + '/' + fileData.key?
    publicLink: '',
    tags: [{ filename }, ...fileData.tags],
    namespace: fileData.namespace,
    mimeType: mimetype,
    size: fileSize
  };
  // Create a file object

  // TODO: Validate the file metadata and stuff

  // TODO: Pass the file into the thing

  return fileMetaRepo.set(db_connection, newFile);
}

function getFile(namespace, key) {
  // Returns a file stream
  return fileDataRepo.getFile(namespace, key);
}

function getSharedLink(fileMeta) {
  return fileDataRepo.getSharedLink(fileMeta.namespace, fileMeta.key);
}

module.exports = { getFile, getFileMeta, uploadFile, getSharedLink };
