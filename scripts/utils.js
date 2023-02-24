const rimraf = require('rimraf');
const file_system = require('fs');
const minimist = require('minimist');

module.exports = {
  deleteDirectory: deleteDirectory,
  createDirIfNotExists: createDirIfNotExists,
  getArtifactFromDirectory: getArtifactFromDirectory,
  getArtifactType: getArtifactType
};

function deleteDirectory(dirName) {

  rimraf(dirName, function (error) {
    console.log('Error: ', error)
  });
}

function createDirIfNotExists(dirName) {

  if (!file_system.existsSync(dirName)) {
    file_system.mkdirSync(dirName);
  }
}

function getArtifactFromDirectory(dirName) {

  const directoryContent = file_system.readdirSync(dirName);

  const artifact = directoryContent.filter(function (elm) {
    return elm.match(/.*\.(tgz)/ig);
  });

  if (artifact.length === 0) {
    console.error('File does not exist');
    process.exit(1);
  }

  return artifact;
}

function getArtifactType() {

  const defaultArtifactType = require('./config').defaultArtifactType;

  const argv = minimist(process.argv.slice(2));
  const artifactType = argv.artifactType || defaultArtifactType;

  return artifactType;
}