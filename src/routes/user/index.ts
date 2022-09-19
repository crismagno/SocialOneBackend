import UserController from "../../controllers/User/index";
import { Application } from "express";
import { upload } from "../../settings/upload";
import UserEnum from "../../shared/user/user.enum";

module.exports = (app: Application): void => {
  app.route(UserEnum.Urls.GET_USERS).post(UserController.getUsers);

  app.route(UserEnum.Urls.SIGN_IN).post(UserController.signIn);

  app.route(UserEnum.Urls.SIGN_UP).post(UserController.create);

  app.route(UserEnum.Urls.GET_USER_BY_ID).post(UserController.getUserById);

  app.route(UserEnum.Urls.LOGOUT).post(UserController.logoutUser);

  app
    .route(UserEnum.Urls.UPDATE_AVATAR)
    .put(upload.single("avatar"), UserController.updateAvatar);

  app
    .route(UserEnum.Urls.UPDATE_PROFILE_INFO)
    .put(UserController.updateProfileInfo);

  app.route(UserEnum.Urls.UPDATE_EMAIL).post(UserController.updateEmail);

  app
    .route(UserEnum.Urls.VALIDATE_EXISTS_EMAIL_CHANGE)
    .post(UserController.validateExistsEmailChange);

  app
    .route(UserEnum.Urls.CANCEL_EMAIL_PENDING_CHANGE)
    .post(UserController.cancelEmailPendingOfChange);

  app
    .route(UserEnum.Urls.VALIDATE_PASSWORD)
    .post(UserController.validatePassword);

  app.route(UserEnum.Urls.UPDATE_PASSWORD).post(UserController.updatePassword);
};
