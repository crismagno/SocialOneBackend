import UserController from "./../controllers/User";

// set new properties in the interface of global NodeJs
declare namespace NodeJS {
    interface Global {
      globalSocket: any;
    }
};

require('dotenv').config({ path: `${__dirname}/../.env` });
import express, { Application } from "express";
import DB from "./../database/index";
import GlobalSocket from "../helpers/socket";
const consign = require("consign");
const http = require("http");

class App {

    private readonly app: Application = express();
    private server = http.createServer(this.app);

    constructor() {
        this.start(); // init application
    };
    /**
     * start all config application: 
     * 1. Database, 
     * 2. script delete socketId, 
     * 3. init socket, 
     * 4. init consign 
     */
    private start = async (): Promise<void> => {
        new DB(); // call database mongodb
        await UserController.updateSocketAllUsers(); // remove all sockets of users and set online to false
        GlobalSocket.start(this.server); // init socket
        this.consignConnection(); // init consign
    };
    /**
     * call config consign
     */
    private consignConnection = (): void => {
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

    /**
     * listen server application
     */
    public listen = (): void => {
        this.server.listen(process.env.PORT, () =>
            console.log(`Server running on -> http://localhost:${process.env.PORT}`)
        );
    }
};

export default App;
