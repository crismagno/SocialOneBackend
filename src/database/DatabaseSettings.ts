export default class DatabaseSettings {
  public static getUrlByEnviroment(): string {
    switch (process.env.NODE_ENV) {
      case "production":
        return String(process.env.DB_ATLAS);
      case "dev":
        return String(process.env.DB_LOCAL);
      default:
        throw "Error enviroment dtabase: without env selected";
    }
  }
}
