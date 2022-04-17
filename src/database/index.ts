require("dotenv").config({ path: `${__dirname}/../../.env` });
import mongoose from "mongoose";
import DatabaseSettings from "./DatabaseSettings";

class SocialOneDataBase {
  private urlDatabase: string = DatabaseSettings.getUrlByEnviroment();
  public start = async (): Promise<void> => {
    try {
      await mongoose.connect(this.urlDatabase, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
      console.log("Database connected...");
    } catch (error) {
      console.log("Error to connect database!!!", error);
    }
  };
}

export default SocialOneDataBase;
