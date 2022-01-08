require('dotenv').config({ path: `${__dirname}/../.env` });
import App from "./app/index";
new App().start(); // start server
