// Controller (Use-cases)
const { fileMetaRepo, fileDataRepo } = require('../repositories');
const { UserInputError } = require('apollo-server-express');

// Get the file from S3
async function getFileMeta(db_connection, file_id) {
  const out = await fileMetaRepo.get(db_connection, file_id);
  return out.getOrElseL(() => {throw new UserInputError("file not found")});
}

async function uploadFile(file, fileData) {
  const { stream, filename, mimetype, encoding } = await file;

  const fileContent = await new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => {
      chunks.push(chunk)
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
    internalLink: '',
    sharedLink: '',
    publicLink: '',
    tags: [{ filename }],
    namespace: 'libero',

    // computed fields
    mimeType: mimetype,
    // Compute the size later?
    // Some other stuff
  };

  const ret = fileMetaRepo.set(db_connection, newFile);
  // Create a file object

  // TODO: Validate the file metadata and stuff

  // TODO: Pass the file into the thing

  console.log("uploadFile");
  return { implemented: false };
}

function getFile(namespace, id) {
  // Returns a file stream
  return fileDataRepo.getFile(namespace, id);
}

module.exports = { getFile, getFileMeta, uploadFile };
