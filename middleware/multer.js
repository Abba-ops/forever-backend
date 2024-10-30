import multer from "multer";
import path from "path";
import { checkFileType } from "../utilities/index.js";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => checkFileType(file, cb),
});

export default upload;
