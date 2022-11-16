import User from "./../../models/User/index";
import { Request, Response } from "express";
import { IUser } from "../../models/User/types";
import { IUserWithToken, TUpdateProfileInfo } from "./types";
import { IUserPayloadToken } from "../../settings/token/types";
import { isValidEmail } from "./../../helpers/global";
import Email from "../../services/email";
import Token from "../../settings/token";
import { scheduleValidateUserActive } from "./../../services/schedule";
import GlobalSocket from "../../infra/GlobalSocket";
import UserEnum from "../../shared/user/user.enum";

const bcrypt = require("bcrypt");

class UserController {
  private readonly saltRounds: number = 10;

  public getUsers = async (req: Request, res: Response): Promise<Response> => {
    const { searchValue, skip, limit } = req.body;

    try {
      const searchValueRegex: RegExp | any = new RegExp(searchValue, "ig");

      const users: IUser[] = await User.find(
        {
          $or: [{ fullName: searchValueRegex }, { email: searchValueRegex }],
          active: true,
        },
        {
          _id: 1,
          fullName: 1,
          email: 1,
          avatar: 1,
          online: 1,
          active: 1,
          role: 1,
        }
      )
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json({
        messasge: `Error when try to get users. Please contact support.`,
      });
    }
  };

  public signIn = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res.status(400).json({ message: "Invalid data." });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid Format email." });
      }

      const user: IUser | null = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid Email or Password." });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ message: "Invalid Email or Password." });
      }

      const payload: IUserPayloadToken = {
        _id: user._id,
        expires: Date.now() + 1000 * 60 * 24,
      };

      const userWithToken: IUserWithToken = {
        _id: `${user._id}`,
        fullName: `${user.fullName}`,
        email: `${user.email}`,
        phone: `${user.phone}`,
        avatar: `${user.avatar}`,
        token: Token.generate(payload),
        role: user.role as UserEnum.Roles,
      };

      await Email.emailWelcome(user);

      return res.status(201).json(userWithToken);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error when try to signIn. Please contact support." });
    }
  };

  public create = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { fullName, email, password, phone } = req.body;

      if (!fullName || !email || !phone || !password)
        return res.status(409).json({ message: "Data informed is invalid" });

      if (!isValidEmail(email))
        return res.status(409).json({ message: "Format email invalid" });

      const userDB: IUser | null = await User.findOne(
        {
          $or: [{ email }, { phone }],
        },
        { email: 1, phone: 1 }
      );

      if (userDB && userDB.email === email)
        return res.status(409).json({ message: "Email not allowed" });

      if (userDB && userDB.phone === phone)
        return res.status(409).json({ message: "Phone not allowed" });

      const passwordWithBcrypt = bcrypt.hashSync(password, this.saltRounds);

      const user: IUser = await User.create({
        fullName,
        email,
        phone,
        password: passwordWithBcrypt,
        role: UserEnum.Roles.NORMAL,
      });

      const payload: IUserPayloadToken = {
        _id: user._id,
        expires: Date.now() + 1000 * 60 * 24,
      };

      const userWithToken: IUserWithToken = {
        _id: `${user._id}`,
        fullName: `${user.fullName}`,
        email: `${user.email}`,
        phone: `${user.phone}`,
        avatar: `${user.avatar}`,
        token: Token.generate(payload),
        role: user.role as UserEnum.Roles,
      };

      // validate if user active account or delete user
      scheduleValidateUserActive(user._id);

      await Email.emailWelcome(user);

      return res.status(201).json(userWithToken);
    } catch (error) {
      console.log(
        `Error to create user: [user email: ${req.body.email}] [user phone: ${req.body.phone}]`,
        error
      );
      return res.status(409).json({
        message: "Error Social network",
      });
    }
  };

  public getUserById = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    const { userId } = req.body;

    try {
      if (!userId)
        return res.status(400).json({
          message: "Data informed is invalid",
        });

      const user: IUser | null = await User.findById({
        _id: userId,
      });

      if (!user)
        return res.status(400).json({
          message: "User not exists",
        });

      const payload: IUserPayloadToken = {
        _id: user._id,
        expires: Date.now() + 1000 * 60 * 24,
      };

      const userWithToken: IUserWithToken = {
        _id: `${user._id}`,
        fullName: `${user.fullName}`,
        email: `${user.email}`,
        phone: `${user.phone}`,
        avatar: `${user.avatar}`,
        token: Token.generate(payload),
        role: user.role as UserEnum.Roles,
      };

      return res.status(201).json(userWithToken);
    } catch (error) {
      return res.status(400).json({
        message: "Error get user. Please contact support",
      });
    }
  };

  /**
   * update online and socketId of User
   */
  public connectUserUpdateOnlineAndSocketId = async (
    userId: string,
    socketId: string
  ): Promise<any> => {
    try {
      if (!userId || !socketId) {
        console.log("Connect socket: userId or socketId empty...");
        return;
      }

      await User.updateOne(
        { _id: userId },
        {
          $set: {
            online: true,
          },
          $addToSet: {
            socketId: socketId,
          },
        }
      );

      console.log(
        `Connect socket: User update your property online and socketId
        [userId: ${userId}]
        [socketId: ${socketId}]`
      );
    } catch (error) {
      console.log(
        `Connect socket: Erro for try update online and socketId
        [userId: ${userId}]
        [socketId: ${socketId}]`,
        error
      );
    }
  };

  /**
   * update online and socketId of User
   */
  public disconnectUserUpdateBySocketId = async (
    socketId: string
  ): Promise<IUser | void | null> => {
    try {
      if (!socketId) {
        console.log("Disconnect socket: socketId empty...");
        return;
      }

      const userDB = await User.findOne(
        { socketId: { $in: [socketId] } },
        {
          socketId: 1,
        }
      );

      const userUpdated: IUser | null = await User.findOneAndUpdate(
        { socketId: { $in: [socketId] } },
        {
          $set: {
            online:
              userDB?.socketId && userDB?.socketId?.length <= 1 ? false : true,
          },
          $pull: {
            socketId: socketId,
          },
        },
        { new: true }
      );

      if (!userUpdated) {
        console.log(
          `Disconnect socket: User not found by socketId [socketId: ${socketId}]`
        );
        return null;
      }

      console.log(
        `Disconnect socket: User update your property online and socketId
        [userId: ${userUpdated._id}]
        [socketId: ${socketId}]`
      );

      return userUpdated;
    } catch (error) {
      console.log(
        "Disconnect socket: Erro for try update online and socketId",
        error
      );
    }
  };

  public logoutUser = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { userId, socketId } = req.body;
      if (!userId || !socketId)
        return res.status(400).json({
          message: "Data informed is invalid",
        });

      const userDB: IUser | null = await User.findById(
        {
          _id: userId,
        },
        {
          socketId: 1,
        }
      );

      const userUpdated: IUser | null = await User.findByIdAndUpdate(
        {
          _id: userId,
        },
        {
          $set: {
            online:
              userDB?.socketId && userDB?.socketId?.length <= 1 ? false : true,
          },
          $pull: {
            socketId: socketId,
          },
        },
        {
          new: true,
        }
      );

      res.status(200).json({
        message: "Logout User Success...",
        type: "success",
      });

      if (userUpdated?.socketId?.length === 0) {
        GlobalSocket.informUserOffLine(userId);
      }

      console.log(
        `Logout User: ${userUpdated?.email}, userId: ${userUpdated?._id}`
      );

      return;
    } catch (error) {
      console.log(
        `Error logout
        [userId: ${req.body.userId}]
        [socketId: ${req.body.socketId}]
      `,
        error
      );
      return res.status(400).json({
        message: "Error logout user...",
      });
    }
  };

  public updateAvatar = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { userId } = req.body;
      const { filename } = req.file;

      if (!userId)
        return res.status(409).json({ message: "Data body malformated" });

      const updateUserAvatar: IUser | null = await User.findByIdAndUpdate(
        {
          _id: userId,
        },
        {
          $set: {
            avatar: filename,
          },
        },
        { new: true }
      );

      if (!updateUserAvatar)
        return res.status(409).json({ message: "Error user isn't exists!" });

      // socket to inform user alter avatar
      GlobalSocket.userUpdateProfileInfo({
        userId,
        property: "avatar",
        newValue: String(updateUserAvatar.avatar),
      });

      console.log(`Success to alter avatar: ${updateUserAvatar.fullName}`);

      return res.status(200).json({
        message: "avatar user changed with success",
        avatar: updateUserAvatar?.avatar,
      });
    } catch (error) {
      console.log(`Error to alter avatar [userId: ${req.body.userId}]`);
      return res.status(409).json({ message: "Error to alter avatar" });
    }
  };

  /**
   * This method is used to clear sockets and status online, all time that api main restart
   */
  public updateSocketAllUsers = async () => {
    try {
      await User.updateMany(
        {},
        {
          $set: {
            socketId: [],
            online: false,
          },
        }
      );
      console.log(`Success at update socketID and online all users`);
    } catch (error) {
      console.log(`Error at update socketID and online all users`, error);
    }
  };

  public updateProfileInfo = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const typePropertyValid: TUpdateProfileInfo = [
        "fullName",
        "email",
        "phone",
      ];
      const { userId, property, newValue } = req.body;

      // valide data of body request
      if (!userId || !property || !newValue)
        return res.status(409).json({
          message: "Format body not is correct",
        });

      // valid if property to update is correct
      if (typePropertyValid.indexOf(property) <= -1)
        return res.status(409).json({
          message: "Property passed to update info isn´t correct",
        });

      // valid property if equal -> email and if email is valid
      if (property === "email" && !isValidEmail(newValue))
        return res.status(409).json({
          message: "Format email invalid",
        });

      const userDB: IUser | null = await User.findById(
        { _id: userId },
        { email: 1, phone: 1, fullName: 1 }
      );

      // valid user exists
      if (!userDB)
        return res.status(409).json({
          message: "User not found",
        });

      // if fullName is the same
      if (property === "fullName" && userDB.fullName === newValue)
        return res.status(409).json({
          message: "Full name is same!",
        });

      // if email is the same
      if (property === "email" && userDB.email === newValue)
        return res.status(409).json({
          message: "Email is same!",
        });

      if (property === "phone" && userDB.phone === newValue)
        return res.status(409).json({
          message: "Phone is same!",
        });

      const findUserHasTheSameNewValue: IUser | null = await User.findOne(
        {
          _id: { $ne: userId },
          [property]: newValue,
        },
        { _id: 1 }
      );

      if (findUserHasTheSameNewValue)
        return res.status(409).json({
          message: `${property} already exists!`,
        });

      const userUpdated: IUser | null | any = await User.findByIdAndUpdate(
        {
          _id: userId,
        },
        {
          $set: {
            [property]: newValue,
          },
        },
        {
          new: true,
        }
      );

      res.status(200).json({
        message: `${property} updated with success!!!`,
        [`${property}`]: userUpdated[property],
      });

      // only emit this socket if property isn´t email
      if (property !== "email") {
        GlobalSocket.userUpdateProfileInfo({
          userId,
          property,
          newValue,
        });
      }

      return;
    } catch (error) {
      return res.status(400).json({
        message: "Erro to update profile",
      });
    }
  };

  public updateEmail = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { userId, newEmail = null } = req.body;

      if (!userId || !newEmail)
        return res.status(400).json({ message: "Body bad format" });

      // valid property if equal -> email and if email is valid
      if (!isValidEmail(newEmail))
        return res.status(409).json({
          message: "Format email invalid",
        });

      const userDB = await User.findById(
        { _id: userId },
        { emailChange: 1, email: 1 }
      );

      if (!userDB) return res.status(400).json({ message: "User not found" });

      // if email is the same
      if (userDB.email === newEmail)
        return res.status(409).json({
          message: "Email is same!",
        });

      if (userDB?.emailChange?.trim())
        return res.status(400).json({
          message: "Already exists email to change",
          value: userDB?.emailChange,
        });

      // query of users that have newValue passed based on property
      const findUserHasTheSameNewValue: IUser | null = await User.findOne(
        {
          _id: { $ne: userId },
          email: newEmail,
        },
        { _id: 1 }
      );

      if (findUserHasTheSameNewValue)
        return res.status(409).json({
          message: `Email already exists!`,
        });

      const userUpdated: IUser | null = await User.findByIdAndUpdate(
        {
          _id: userId,
        },
        {
          $set: {
            emailChange: newEmail,
          },
        },
        {
          new: true,
        }
      );

      if (!userUpdated)
        return res.status(400).json({ message: "User updated not found" });

      res.status(200).json({
        message: `Espect only validate code to email change ${userUpdated?.emailChange}`,
        value: userUpdated?.emailChange,
      });

      await Email.emailToRequestChangeEmailUser(userUpdated);

      console.log(`Success to change email [userId: ${userId}]`);

      return;
    } catch (error) {
      console.log(`Error to change email [userId: ${req.body.userId}]`, error);
      return res.status(400).json({ message: "Error to change email" });
    }
  };

  public validateExistsEmailChange = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { userId } = req.body;

      if (!userId) return res.status(400).json({ message: "Body bad format" });

      const userDB = await User.findById({ _id: userId }, { emailChange: 1 });

      if (!userDB) return res.status(400).json({ message: "User not found" });

      if (!userDB?.emailChange?.trim())
        return res.status(200).json({
          message: "Email change empty",
          value: null,
        });

      return res.status(200).json({
        message: `Email change ${userDB.emailChange}`,
        value: userDB.emailChange,
      });
    } catch (error) {
      console.log(
        `Error to get validate email change: [userId: ${req.body.userId}]`
      );
      return res
        .status(400)
        .json({ message: "Error to get validate email change" });
    }
  };

  public cancelEmailPendingOfChange = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { userId } = req.body;

      if (!userId) return res.status(400).json({ message: "Body bad format" });

      const userUpdated = await User.findByIdAndUpdate(
        { _id: userId },
        {
          $set: {
            emailChange: "",
          },
        },
        {
          new: true,
        }
      );

      if (!userUpdated)
        return res.status(400).json({ message: "User updated not found" });

      console.log(`User email to change canceled with success: ${userId}`);

      return res.status(200).json({
        message: `User email to change canceled with success!`,
      });
    } catch (error) {
      console.log(
        `Error on cancel email to change: [userId: ${req.body.userId}]`
      );
      return res
        .status(400)
        .json({ message: "Error on cancel email to change" });
    }
  };

  public validatePassword = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { userId, password } = req.body;

      if (!userId || !password)
        return res.status(400).json({ message: "Data informed is invalid" });

      const userDB: IUser | null = await User.findById(userId, {
        password: 1,
      });

      if (!userDB) return res.status(400).json({ message: "User is invalid" });

      const passwordCompare = await bcrypt.compare(password, userDB.password);
      if (!passwordCompare)
        return res.status(400).json({ message: "Password invalid" });

      return res.status(201).json({
        message: "Password is valid",
        value: true,
      });
    } catch (error) {
      console.log(
        `Error to do validate password USER_ID=> ${req.body.userId}`,
        error
      );
      return res.status(400).json({ message: "Error Social network" });
    }
  };

  public updatePassword = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { userId, newPassword = null } = req.body;

      if (!userId || !newPassword)
        return res.status(400).json({ message: "Body bad format" });

      const userDB = await User.findById(userId, { password: 1 });

      if (!userDB) return res.status(400).json({ message: "User not found" });

      // if password is the same
      const passwordCompare = await bcrypt.compare(
        newPassword,
        userDB.password
      );
      if (passwordCompare)
        return res.status(400).json({ message: "Password is the same!" });

      const newPasswordWithBcrypt = bcrypt.hashSync(
        newPassword,
        this.saltRounds
      );

      const userUpdated: IUser | null = await User.findByIdAndUpdate(
        {
          _id: userId,
        },
        {
          $set: {
            password: newPasswordWithBcrypt,
          },
        },
        {
          new: true,
        }
      );

      if (!userUpdated)
        return res.status(400).json({ message: "User updated not found" });

      return res.status(200).json({
        message: `Password updated with success!`,
      });
    } catch (error) {
      console.log(
        `Error to update password [userId: ${req.body.userId}]`,
        error
      );
      return res.status(400).json({ message: "Error to update password" });
    }
  };
}

export default new UserController();
