const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const profilePictureStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Barangay-User-Image",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

const idCardStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'idcards',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});


module.exports = {
  cloudinary,
  profilePictureStorage,
  idCardStorage
};
