import colors from "colors";
import EnviromentEnum from "../../settings/enviroment/enviroment.enum";
import { ELogColors, EModules, LogColorsStatus } from "./types";

colors.setTheme(ELogColors);

export default class Log {
  /**
   * ALERT: message string of variable finalMessage must keep on start line
   * @param text - Message
   * @param module - What module system
   * @param logColor - type color to log show
   */
  public static show = ({
    message,
    module = "",
    logColor = LogColorsStatus.NONE,
  }: {
    message: string;
    module?: EModules | string;
    logColor?: LogColorsStatus;
  }): void => {
    if (process.env.NODE_ENV === EnviromentEnum.Enviroment.DEVELOPMENT) {
      const finalMessage = `
        -------------------------------------------------------
        Module: ${module}
        Message: ${message}
        -------------------------------------------------
        `.trim();
      console.log(colors[ELogColors[logColor]](finalMessage));
    }
  };

  public static error = ({
    message,
    module = "",
  }: {
    message: string;
    module?: EModules | string;
  }): void => {
    Log.show({ message, module, logColor: LogColorsStatus.ERROR });
  };

  public static success = ({
    message,
    module = "",
  }: {
    message: string;
    module?: EModules | string;
  }): void => {
    Log.show({ message, module, logColor: LogColorsStatus.SUCCESS });
  };

  public static info = ({
    message,
    module = "",
  }: {
    message: string;
    module?: EModules | string;
  }): void => {
    Log.show({ message, module, logColor: LogColorsStatus.INFO });
  };

  public static warn = ({
    message,
    module = "",
  }: {
    message: string;
    module?: EModules | string;
  }): void => {
    Log.show({ message, module, logColor: LogColorsStatus.WARN });
  };
}
