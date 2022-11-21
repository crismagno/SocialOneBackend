import UserController from "./../controllers/User";
import express, { Express } from "express";
import DataBase from "./../database";
import GlobalSocket from "../infra/GlobalSocket";
import SocialOneConsign from "../infra/SocialOneConsign";
import http from "http";
import ServerCluster from "../infra/ServerCluster";
import CronSchedule from "../services/cron-shedule";

export default class App {
  private readonly app: Express = express();

  private readonly server: http.Server = http.createServer(this.app);

  private readonly dataBaseInstance: DataBase = DataBase.getInstance();

  public start = async (): Promise<void> => {
    await this.dataBaseInstance.start();
    /**
     * Remove all sockets of users and set online to false
     * Note: Idea here is remove that method and create an method that do some things before start application
     */
    await UserController.updateSocketAllUsers();

    GlobalSocket.start(this.server);

    new SocialOneConsign(this.app).start();

    new ServerCluster(this.server).start();

    CronSchedule.inactivateUsers();
  };
}
