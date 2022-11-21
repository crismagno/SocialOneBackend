import MainEnum from "../../shared/main/main.enum";
import { Application, Request, Response } from "express";
import path from "path";

module.exports = (app: Application): void => {
  app.route(MainEnum.Urls.INITIAL).get((req: Request, res: Response): void => {
    res.sendFile(path.resolve(__dirname + `../../../views/homeIndex.html`));
  });
};
