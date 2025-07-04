// src/middleware/multerConfig.js
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "src", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `upload_${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
