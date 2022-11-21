import { IUser } from "@src/models/User/types";
import moment from "moment";
import User from "../../models/User";
import Log from "../../infra/Log";
import UserEnum from "../../shared/user/user.enum";
import { FilterQuery } from "mongoose";
import { EModules } from "../../infra/Log/types";
const schedule = require("node-schedule");

export default class CronSchedule {
  private static readonly TIME_TO_RUN_INACIVATE_USERS: string =
    "0 0 */23 * * *"; // every 24 hours

  private static isExecutingInactivateUsers: boolean = false;

  public static inactivateUsers = (): void => {
    Log.success({
      message: "Started (inactivateUsers)",
      module: EModules.CRON_SCHEDULE,
    });

    schedule.scheduleJob(CronSchedule.TIME_TO_RUN_INACIVATE_USERS, async () => {
      if (CronSchedule.isExecutingInactivateUsers) {
        Log.warn({
          message: "Inactivate Users is Running already...",
          module: EModules.CRON_SCHEDULE,
        });

        return;
      }

      Log.info({
        message: `Inactivate Users is Starting... At ${moment().toDate()}`,
        module: EModules.CRON_SCHEDULE,
      });

      CronSchedule.isExecutingInactivateUsers = true;

      const getDateOneDayAgo: Date = moment()
        .subtract(1, "days")
        .utc()
        .toDate();

      const query: FilterQuery<IUser> = {
        active: false,
        createdAt: {
          $lte: getDateOneDayAgo,
        },
        status: { $ne: UserEnum.Status.INACTIVE },
      };

      const countUsersToInactivate: number = await User.countDocuments(query);

      if (countUsersToInactivate > 0) {
        await User.updateMany(query, {
          $set: {
            status: UserEnum.Status.INACTIVE,
          },
        });
      }

      Log.info({
        message: `Inactivate Users Ended. Total: ${countUsersToInactivate}.  At ${moment().toDate()}`,
        module: EModules.CRON_SCHEDULE,
      });

      CronSchedule.isExecutingInactivateUsers = false;
    });
  };
}
