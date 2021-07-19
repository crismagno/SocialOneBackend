import { Application } from "express";
import MessageController from "../../controllers/Message/index";

module.exports = (app: Application): void => {
    app.route("/message/create")
        .post(MessageController.create);
    
    app.route("/message/by_chat_id")
        .post(MessageController.getMessagesByChatId);
    
    app.route("/message/by_chat_id_and_date")
        .post(MessageController.getMessagesByChatIdAndDate);
    
    app.route("/message/remove")
        .post(MessageController.removeMessages);
};