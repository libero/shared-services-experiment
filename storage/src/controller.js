// Controller (Use-cases)

// Get the file from S3
function getFileMeta(path) {
  return { implemented: false };
}

function uploadFile(fstream, fmeta) {
  return { implemented: false };
}

function getFile(path) {
  // Returns a file stream
  return { implemented: false };
}

module.exports = { getFile, getFileMeta, uploadFile };
