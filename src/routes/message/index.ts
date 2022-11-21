import MessageEnum from "../../shared/message/message.enum";
import { Application } from "express";
import MessageController from "../../controllers/Message/index";

module.exports = (app: Application): void => {
  app.route(MessageEnum.Urls.CREATE).post(MessageController.create);

  app
    .route(MessageEnum.Urls.GET_MESSAGES_BY_CHAT_ID)
    .post(MessageController.getMessagesByChatId);

  app
    .route(MessageEnum.Urls.GET_MESSAGES_BY_CHAT_ID_AND_DATE)
    .post(MessageController.getMessagesByChatIdAndDate);

  app.route(MessageEnum.Urls.REMOVE).post(MessageController.removeMessages);
};
