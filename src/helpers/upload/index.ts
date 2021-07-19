import multer from "multer";

const Storage = multer.diskStorage({
  destination(req, file, callback) {
    try {
      callback(null, `${__dirname}/../../uploads`)
    } catch (error) {
      console.log(`Error destination multer upload `, error);
    }
  },
  filename(req, file, callback) {
    try {
      callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
    } catch (error) {
      console.log(`Error filename multer upload `, error);
    }
  },
});

export const upload = multer({ storage: Storage });