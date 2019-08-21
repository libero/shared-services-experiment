const fs = require('fs');

// Controller (Use-cases)
const { fileMetaRepo, fileDataRepo } = require('../repositories');
const { UserInputError } = require('apollo-server-express');

// Get the file from S3
async function getFileMeta(db_connection, file_id) {
  const out = await fileMetaRepo.get(db_connection, file_id);
  return out.getOrElseL(() => {throw new UserInputError("file not found")});
}

async function uploadFile(file, fileData) {
  var fileStream = fs.createReadStream(file);
  fileStream.on('error', function(err) {
    console.error(`Error reading stream for file: ${fileData.id}`, err);
  });
  // store file
  await fileDataRepo.putFile(fileStream, fileData);
  // store meta
  const { stream, filename, mimetype, encoding } = await file;

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
