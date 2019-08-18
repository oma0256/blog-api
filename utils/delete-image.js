const fs = require("fs");
const path = require("path");
const rootPath = require("./root-path");

module.exports = imageName => {
  fs.unlink(path.join(rootPath, imageName));
};
