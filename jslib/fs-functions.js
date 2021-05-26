const fs = require('fs');
const shell = require('shelljs');
async function createDirIfNotExists(path) {
  if(!path) throw "No path to create dir";
  let subdirs = [];
  if(path[0] === "/") {
    subdirs = path.slice(1).split("/")
    subdirs[0] = "/" + subdirs[0];
  } else {
    subdirs = path.split("/");
  }
  if(!subdirs[subdirs.length-1])
    subdirs.splice(subdirs.length-1)

  for(let index=0; index<subdirs.length; index++) {
    let subpath = subdirs.slice(0,index+1).join("/");
    if(!subdirs[index])
      throw "wrong path: " + path;
    if (!fs.existsSync(subpath)){
      shell.mkdir('-p', subpath);
    }
  }
}
exports.createDirIfNotExists = createDirIfNotExists;