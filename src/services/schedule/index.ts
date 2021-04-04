import User from "../../models/User";
const schedule = require('node-schedule');

export const scheduleValidateUserActive = (userId: string): void => {
    const timeSchedule: number = (1000 * 60 * 60); // 1 minute
    setTimeout(async () => {
        const user = await User.findOne({ _id: userId });
        if (user) {
            if (user.active) {
                console.log("User already active!");
            } else {
                await User.deleteOne({ _id: userId });
                console.log("User deleted by schedule...")
            }
        } else {
            console.log("User not exists!")
        }
    }, timeSchedule);
} 

export default {
    scheduleValidateUserActive
}
