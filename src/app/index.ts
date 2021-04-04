// set new properties in the interface of global NodeJs
declare namespace NodeJS {
    interface Global {
      globalSocket: any;
    }
};

require('dotenv').config({ path: `${__dirname}/../.env` });
import express from "express";
import DB from "./../database/index";
import GlobalSocket from "../helpers/socket";
const consign = require("consign");
const http = require("http");

class App {

    public app: express.Application;
    public server;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        GlobalSocket.start(this.server);
        this.dbConnection();
        this.consignConnection();
    };

    private dbConnection(): void {
        new DB().connection();
    };

    private consignConnection(): void {
        consign({
            cwd: __dirname + "/../",
            locale: "en-us",
            logger: console,
            verbose: true,
            extensions: [ ".js", ".json", ".node", ".ts" ],
            loggingType: "info"
        })
            .then("./settings/middleware/index.ts")
            .then("./controllers")
            .then("./routes")
            .into(this.app);
    };
};

export default new App().server;