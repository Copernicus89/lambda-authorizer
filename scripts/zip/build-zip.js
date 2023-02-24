const utils = require('../utils');
const file_system = require('fs');
const archiver = require('archiver');

const bundleDir = require('../config').bundleDir;
const outputDir = require('../config').outputDir;
const artifactType = utils.getArtifactType();

utils.createDirIfNotExists(outputDir);

const package = require(process.cwd() + '/package.json');

const name = package.name.split('/')[1] || package.name;
const outputZipName = `${name}-${package.version}${artifactType}`;
const output = file_system.createWriteStream(`${outputDir}${outputZipName}.zip`);
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', function () {

  console.log(archive.pointer() + ' total bytes compressed');

  utils.deleteDirectory(bundleDir);
});

archive.on('error', function (err) {

  throw err;
});

archive.pipe(output);
archive.directory(bundleDir, false);
archive.finalize();
