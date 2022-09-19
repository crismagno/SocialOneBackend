import UserController from "../../controllers/User/index";
import { Application } from "express";
import { upload } from "../../settings/upload";

module.exports = (app: Application): void => {
  app.route("/user").post(UserController.getUsers);

  app.route("/user/signin").post(UserController.signIn);

  app.route("/user/signup").post(UserController.create);

  app.route("/user/by_id").post(UserController.getUserById);

  app.route("/user/logout").post(UserController.logoutUser);

  app
    .route("/user/avatar")
    .put(upload.single("avatar"), UserController.alterAvatar);

  app.route("/user/profile").put(UserController.updateProfileInfo);

  app.route("/user/change_email").post(UserController.changeEmail);

  app
    .route("/user/validate_exists_email_change")
    .post(UserController.validateExistsEmailChange);

  app
    .route("/user/cancel_email_pending_change")
    .post(UserController.cancelEmailPendingOfChange);

  app.route("/user/validate_password").post(UserController.validatePassword);

  app.route("/user/update_password").post(UserController.updatePassword);
};
