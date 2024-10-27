const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRETKEY 
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'your-folder-name',  // Folder in Cloudinary to store your images
      allowed_formats: ['jpg', 'png', 'jpeg'],  // Specify allowed formats
    },
  });
  
  module.exports = { cloudinary, storage };