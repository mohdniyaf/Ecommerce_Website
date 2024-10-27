//Create a multer.js file
const multer =require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });


const multerMiddleware = upload.array('images', 4);

module.exports = multerMiddleware;