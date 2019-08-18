const multer = require("multer");
const path = require("path");
const rootPath = require("./root-path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(rootPath, "images"));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}`);
  }
});

const fileFilter = (req, file, cb) => {
  const imageTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (imageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({ storage, fileFilter });
