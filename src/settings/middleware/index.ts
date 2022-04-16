require("dotenv").config({ path: `${__dirname}/../.env` });
import cors from "cors";
import express, { json, urlencoded, Request, Response, Express } from "express";
import configs from "./configs";
const logger = require("morgan");
const compression = require("compression");
const expressJWT = require("express-jwt");
const path = require("path");

module.exports = (app: Express) => {
  app.use(express.static(path.resolve(__dirname + `../../../views`)));
  app.get("/files", (req: Request, res: Response): void => {
    res.sendFile(
      path.resolve(__dirname + `../../../uploads/${req.query.file}`)
    );
  });
  app.use(
    cors({
      origin: "*",
    })
  );
  /**
   * Compression data of request
   */
  app.use(
    compression({
      filter: configs.shouldCompress,
      threshold: 512, // tamanho em bytes a ser considerado para a compressão
    })
  );
  app.use(json({ limit: "25mb" }));
  app.use(logger("dev"));
  app.use(
    urlencoded({
      limit: "25mb",
      extended: true,
      parameterLimit: 10000000,
    })
  );
  app.use(
    expressJWT({
      secret: process.env.JWT_SECRET_KEY,
      algorithms: ["HS256"],
    }).unless(configs.publicRoutes)
  );
};
