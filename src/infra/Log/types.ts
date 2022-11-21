export enum EModules {
  APP = "APP",
  MIDDLEWARES = "MIDDLEWARES",
  GLOBAL_SOCKET = "GLOBAL_SOCKET",
  LOG = "LOG",
  NONE = "NONE",
  SERVER = "SERVER",
  ROUTES = "ROUTES",
  MAIN = "MAIN",
  CRON_SCHEDULE = "CRON_SCHEDULE",
}

export const ModulesLabels = {
  APP: "App",
  MIDDLEWARES: "Middlewares",
  SOCKET_SOCIAL: "Socket Social",
  LOG: "Log",
  NONE: "None",
  SERVER: "Server",
  ROUTES: "Routes",
  MAIN: "Main",
  CronSchedule: "Cron Schedule",
};

export enum ELogColors {
  info = "blue",
  help = "cyan",
  warn = "yellow",
  success = "green",
  error = "red",
  none = "white",
}
export enum LogColorsStatus {
  SUCCESS = "success",
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  NONE = "none",
}
