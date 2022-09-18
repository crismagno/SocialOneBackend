import mongoose from "mongoose";
import Log from "../infra/Log";
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
      Log.success({ message: "Database connected..." });
    } catch (error: any) {
      Log.error({ message: `Error to connect database: ${error.message}` });
      throw new Error(error);
    }
  };
}

export default SocialOneDataBase;
