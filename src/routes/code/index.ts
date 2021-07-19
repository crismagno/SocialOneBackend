import { Application } from "express";
import CodeController from "../../controllers/Code/index";

module.exports = (app: Application): void => {
    app.route("/code/validate")
        .post(CodeController.validateCode);
        
    app.route("/code/resend")
    .post(CodeController.resendCode);
    
    app.route("/code/validate_change_email")
        .post(CodeController.validateCodeChangeEmail);
};