require("dotenv").config({ path: `${__dirname}/../.env` });
import App from "./app/index";

const app: App = new App();

app.start();
