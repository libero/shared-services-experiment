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
  return { implemented: false };
}

function getFile(namespace, id) {
  // Returns a file stream
  return fileDataRepo.getFile(namespace, id);
}

module.exports = { getFile, getFileMeta, uploadFile };
