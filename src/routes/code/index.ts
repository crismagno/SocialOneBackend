import CodeController from "../../controllers/Code/index";

module.exports = (app: any) => {
    app.route("/code/validate")
        .post(CodeController.validateCode);

    app.route("/code/resend")
        .post(CodeController.resendCode);
};