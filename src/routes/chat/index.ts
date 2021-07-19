import { Application } from "express";
import ChatController from "../../controllers/Chat/index";

module.exports = (app: Application): void => {
    app.route("/chat")
        .post(ChatController.create);
    
    app.route("/chat/by_user")
        .post(ChatController.getChatsByUser);
    
    app.route("/chat/by_chat_id")
        .post(ChatController.getChatById);
};