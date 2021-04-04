import UserController from "../../controllers/User/index";

module.exports = (app: any) => {
    app.route("/user")
        .post(UserController.getUsers);

    app.route("/user/signin")
        .post(UserController.signIn);

    app.route("/user/signup")
        .post(UserController.create);
};