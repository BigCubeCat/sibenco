import UserModel, {
  generatePasswordHash,
  I_UserDocument,
  userWithoutPass,
} from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {config} from '../config';

export async function createAdmin() {
  const query = {email: config.admin.email};
  const pass = await generatePasswordHash(config.admin.password);
  const update = {password: pass, role: 'admin'};
  const options = {upsert: true, new: true, setDefaultsOnInsert: true};

  await UserModel.findOneAndUpdate(query, update, options);
}

export async function createUser(user: I_UserDocument) {
  try {
    const newUser = await UserModel.create(user);
    if (!newUser) {
      throw Error(config.errors.Create + 'user');
    }
    return userWithoutPass(newUser);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function login(user: {email: string; password: string}) {
  try {
    const foundUser = await UserModel.findOne({email: user.email});
    if (!foundUser) {
      throw new Error('Name of user is not correct');
    }
    const isMatch = bcrypt.compareSync(user.password, foundUser.password);
    if (isMatch) {
      const token = jwt.sign(
        {_id: foundUser._id?.toString(), email: foundUser.email},
        config.JWT_SECRET,
      );

      return {
        user: userWithoutPass(foundUser),
        token: token,
      };
    } else {
      throw new Error('Password is not correct');
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUser(_id: string) {
  try {
    const foundUser = await UserModel.findOne({_id});
    if (!foundUser) {
      throw new Error(config.errors.NotFound + 'user');
    }
    return foundUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getOtherUser(email: string) {
  try {
    const foundUser = await UserModel.findOne({email});
    if (!foundUser) {
      throw new Error(config.errors.NotFound + 'user');
    }
    return userWithoutPass(foundUser);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function patchUser(email: string, newData: any) {
  try {
    const foundUser = await UserModel.findOneAndUpdate({email}, newData, {
      upsert: true,
    });
    if (!foundUser) {
      throw new Error(config.errors.Update + 'user');
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
      username: {$regex: email},
      name: {$regex: name},
      surname: {$regex: surname},
    }).limit(20);
    return users.map((user) => userWithoutPass(user));
  } catch (error) {
    console.log(error);
    throw error;
  }
}
