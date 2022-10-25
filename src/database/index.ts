import mongoose from "mongoose";
import Log from "../infra/Log";
import EnviromentEnum from "../settings/enviroment/enviroment.enum";

export default class SocialOneDataBase {
  private urlDatabase: string = SocialOneDataBase.getUrlByEnviroment();
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

  private static getUrlByEnviroment = (): string => {
    const enviroment = process.env.NODE_ENV as EnviromentEnum.enviroment;
    switch (enviroment) {
      case EnviromentEnum.enviroment.PRODUCTION:
        return String(process.env.DB_ATLAS);
      case EnviromentEnum.enviroment.DEVELOPMENT:
        return String(process.env.DB_DEVELOPMENT);
      default:
        throw new Error("Error enviroment database: without env selected");
    }
  };
}
