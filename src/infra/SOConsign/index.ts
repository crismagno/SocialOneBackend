import { Application } from "express";

const consign = require("consign");

export class SOConsign {
    constructor(private app: Application) {}

     public start = (): void => {
        consign({
            cwd: __dirname + "/../../",
            locale: "en-us",
            logger: console,
            verbose: true,
            extensions: [ ".js", ".json", ".node", ".ts", ".css" ],
            loggingType: "info"
        })
            .then("./settings/middleware/index.ts")
            .then("./controllers")
            .then("./routes")
            .into(this.app);
    };
}

export default SOConsign;
