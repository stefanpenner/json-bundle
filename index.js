const walkSync = require('walk-sync');
const ROOT = __dirname + '/prebuilt/addon';
const fs = require('fs-extra');
const zlib = require('zlib');
const Plugin = require('broccoli-plugin');
const DS_STORE = /\.DS_Store/;

module.exports.directoryAsJSON = directoryAsJSON;
function directoryAsJSON(root) {
  return walkSync.entries(root).map(entry => {
    if (DS_STORE.test(entry.relativePath)) { return; }

    let entryData = {
      relativePath: entry.relativePath,
      mode: entry.mode,
      content: undefined
    };

    if (!entry.isDirectory()) {
      entryData.content = fs.readFileSync(entry.basePath + '/' + entry.relativePath, 'UTF8');
    }

    return entryData;
  }, {}).filter(Boolean);
}

module.exports.gzipJSON = gzipJSON;
function gzipJSON(json) {
  return zlib.gzipSync(JSON.stringify(json));
}

module.exports.gunzipJSON = gunzipJSON;
function gunzipJSON(buffer) {
  return JSON.parse(zlib.gunzipSync(buffer));
}

module.exports.ls = ls;
function ls(path) {
  console.log(gunzipJSON(gzipJSON(directoryAsJSON(ROOT))).map(x =>  x.relativePath));
}

module.exports.directoryToBundle = directoryToBundle;
function directoryToBundle(path, name) {
  fs.writeFileSync(name, gzipJSON(directoryAsJSON(path)));
}

module.exports.bundleToDirectory = bundleToDirectory;
function bundleToDirectory(path, output) {
  if (fs.existsSync(output)) {
    throw new Error(`path: '${output}' already exists`);
  }

  fs.mkdirpSync(output);

  gunzipJSON(fs.readFileSync(path)).forEach(entry => {
    if (isDirectory(entry)) {
      fs.mkdirSync(output + '/' + entry.relativePath);
    } else {
      fs.writeFileSync(output + '/' + entry.relativePath, entry.content);
    }
  });
}

function isDirectory(entry) {
  return (entry.mode & 61440) === 16384;
}

