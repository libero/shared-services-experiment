// Controller (Use-cases)

const {fileMetaRepo} = require('../repositories');
const { UserInputError } = require('apollo-server-express');

// Get the file from S3
async function getFileMeta(db_connection, file_id) {
  const out = await fileMetaRepo.get(db_connection, file_id);
  return out.getOrElseL(() => {throw new UserInputError("file not found")});
}

function uploadFile(fstream, fmeta) {
  return { implemented: false };
}

function getFile(path) {
  // Returns a file stream
  return { implemented: false };
}

module.exports = { getFile, getFileMeta, uploadFile };
