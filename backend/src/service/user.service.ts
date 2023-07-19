import UserModel, { userWithoutPass } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config as env } from "../config";

export async function createAdmin() {
  const query = { email: env.admin.email };
  const update = { password: env.admin.password };
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };

  await UserModel.findOneAndUpdate(query, update, options);
}



export async function login(user: { username: string; password: string }) {
  try {
    const foundUser = await UserModel.findOne({ username: user.username });
    console.log(foundUser);
    if (!foundUser) {
      throw new Error("Name of user is not correct");
    }
    const isMatch = bcrypt.compareSync(user.password, foundUser.password);
    if (isMatch) {
      const token = jwt.sign(
        { _id: foundUser._id?.toString(), email: foundUser.email },
        env.JWT_SECRET
      );

      return {
        user: userWithoutPass(foundUser),
        token: token,
      };
    } else {
      throw new Error("Password is not correct");
    }
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export async function getUser(_id: string) {
  try {
    const foundUser = await UserModel.findOne({ _id });
    if (!foundUser) {
      throw new Error("User incorrect");
    }
    return foundUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getOtherUser(email: string) {
  try {
    const foundUser = await UserModel.findOne({ email });
    if (!foundUser) {
      throw new Error("User incorrect");
    }
    return userWithoutPass(foundUser);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function patchUser(email: string, newData: any) {
  try {
    const foundUser = await UserModel.findOneAndUpdate({ email }, newData, {
      upsert: true,
    });
    if (!foundUser) {
      throw new Error("Error");
    }
    return userWithoutPass(foundUser);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function searchUsers(
  email: string,
  name: string,
  surname: string,
) {
  try {
    const users = await UserModel.find({
      username: { $regex: email },
      name: { $regex: name },
      surname: { $regex: surname },
    }).limit(20);
    const withoutPasswords = users.map((user) => userWithoutPass(user));
    return withoutPasswords;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
