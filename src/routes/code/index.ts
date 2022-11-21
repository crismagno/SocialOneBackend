import CodeEnum from "../../shared/code/code.enum";
import { Application } from "express";
import CodeController from "../../controllers/Code/index";

module.exports = (app: Application): void => {
  app.route(CodeEnum.Urls.VALIDATE).post(CodeController.validateCode);

  app.route(CodeEnum.Urls.RESEND).post(CodeController.resendCode);

  app
    .route(CodeEnum.Urls.VALIDATE_CHANGE_EMAIL)
    .post(CodeController.validateCodeChangeEmail);
};
