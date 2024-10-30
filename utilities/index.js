import path from "path";

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const checkFileType = (file, cb) => {
  const allowedFileTypes = /jpg|jpeg|png/;
  const isExtensionValid = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isMimeTypeValid = allowedFileTypes.test(file.mimetype);

  if (isExtensionValid && isMimeTypeValid) {
    cb(null, true);
  } else {
    cb("Invalid file type: only JPEG, JPG, and PNG files are allowed.");
  }
};
