const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// Ensure folder exists
const dir = path.resolve(process.cwd(), "public/data/images");
if (!fs.existsSync(dir))
  {
  fs.mkdirSync(dir, { recursive: true }); // recursive ensures all parent folders create aagum
}

console.log("Image upload directory:", dir);  

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  }
});

const upload = multer({ storage });

module.exports = upload;