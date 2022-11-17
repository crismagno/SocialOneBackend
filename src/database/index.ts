import mongoose from "mongoose";
import Log from "../infra/Log";
import EnviromentEnum from "../settings/enviroment/enviroment.enum";

export default class DataBase {
  private static instance = new DataBase();

  private constructor() {}

  public static getInstance = (): DataBase => DataBase.instance;

  public start = async (): Promise<void> => {
    try {
      const databaseUrl: string = DataBase.getUrlByEnviroment();

      await mongoose.connect(databaseUrl, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });

      Log.success({ message: "Database connected..." });
    } catch (error: any) {
      Log.error({
        message: `Error when try to connect database: ${error.message}`,
      });
      throw new Error(error);
    }
  };

  private static getUrlByEnviroment = (): string => {
    const enviroment = process.env.NODE_ENV as EnviromentEnum.Enviroment;

    switch (enviroment) {
      case EnviromentEnum.Enviroment.PRODUCTION:
        return String(process.env.DB_ATLAS);
      case EnviromentEnum.Enviroment.DEVELOPMENT:
        return String(process.env.DB_DEVELOPMENT);
      default:
        throw new Error("Error enviroment database: without env selected.");
    }
  };
}
