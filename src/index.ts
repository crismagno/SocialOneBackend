require("dotenv").config({ path: `${__dirname}/../.env` });
import App from "./app/index";
const appInstance: App = new App();

/**
 * Start Application
 */
appInstance.start();
