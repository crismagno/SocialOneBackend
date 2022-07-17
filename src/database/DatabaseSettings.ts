import EnviromentEnum from "../settings/enviroment/enviroment.enum";

export default class DatabaseSettings {
  public static getUrlByEnviroment(): string {
    const enviroment: EnviromentEnum.enviroment = process.env
      .NODE_ENV as EnviromentEnum.enviroment;
    switch (enviroment) {
      case EnviromentEnum.enviroment.PRODUCTION:
        return String(process.env.DB_ATLAS);
      case EnviromentEnum.enviroment.DEVELOPMENT:
        return String(process.env.DB_DEVELOPMENT);
      default:
        throw new Error("Error enviroment dtabase: without env selected");
    }
  }
}
