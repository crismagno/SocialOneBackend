import ChatEnum from "../../shared/chat/chat.enum";
import { Application } from "express";
import ChatController from "../../controllers/Chat/index";

module.exports = (app: Application): void => {
  app.route(ChatEnum.Urls.CREATE).post(ChatController.create);

  app.route(ChatEnum.Urls.GET_CHAT_BY_USER).post(ChatController.getChatsByUser);

  app.route(ChatEnum.Urls.GET_CHAT_BY_ID).post(ChatController.getChatById);
};
