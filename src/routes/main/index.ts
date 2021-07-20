import { Application, Request, Response } from "express";
import path from "path";

module.exports = (app: Application): void => {
    app.route("/")
        .get((req: Request, res: Response): void => {
            res.sendFile(path.resolve(__dirname+ `../../../pagesHtml/homeIndex.html`));
        });
};