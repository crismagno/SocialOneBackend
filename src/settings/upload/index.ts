import multer from "multer";
import Log from "../../infra/Log";

const Storage: multer.StorageEngine = multer.diskStorage({
  destination(req, file, callback) {
    try {
      callback(null, `${__dirname}/../../uploads`);
    } catch (error: any) {
      Log.error({
        message: `Error destination multer upload: ${error.message} `,
      });
    }
  },
  filename(req, file, callback) {
    try {
      callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    } catch (error: any) {
      Log.error({ message: `Error filename multer upload: ${error.message}` });
    }
  },
});

export const upload: multer.Multer = multer({ storage: Storage });
