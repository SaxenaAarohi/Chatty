import multer from "multer";

// Configure multer storage (files saved temporarily in 'uploads/' folder)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save videos temporarily
  },
  filename: function (req, file, cb) {
    // Use original filename or generate a custom one
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter to allow only video mimetypes
const videoFileFilter = (req, file, cb) => {
    
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed!"), false);
  }
};

// Create multer instance with storage and file filter
const uploadVideo = multer({
  storage,
  fileFilter: videoFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // optional: max file size 100MB
});

export default uploadVideo;
