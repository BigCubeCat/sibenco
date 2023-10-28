import UserModel, {
  generatePasswordHash,
  I_UserDocument,
  userWithoutPass,
} from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {config} from '../../config';

/*
createAdmin()
create ROOT-user with data from config
 */
export async function createAdmin() {
  const query = {email: config.admin.email};
  const pass = await generatePasswordHash(config.admin.password);
  const update = {password: pass, role: 'admin'};
  const options = {upsert: true, new: true, setDefaultsOnInsert: true};

  await UserModel.findOneAndUpdate(query, update, options);
}

/*
createUser(user: IUserDocument)
register new user
 */
export async function createUser(user: I_UserDocument) {
  const newUser = await UserModel.create(user);
  if (!newUser) {
    throw Error(config.errors.Create + 'user');
  }
  return userWithoutPass(newUser);
}

export async function login(user: { email: string; password: string }) {
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
}

export async function getUser(_id: string) {
  const foundUser = await UserModel.findOne({_id});
  if (!foundUser) {
    throw new Error(config.errors.NotFound + 'user');
  }
  return foundUser;
}

export async function getOtherUser(email: string) {
  const foundUser = await UserModel.findOne({email});
  if (!foundUser) {
    throw new Error(config.errors.NotFound + 'user');
  }
  return userWithoutPass(foundUser);
}

export async function patchUser(email: string, newData: any) {
  const foundUser = await UserModel.findOneAndUpdate({email}, newData, {
    upsert: true,
  });
  if (!foundUser) {
    throw new Error(config.errors.Update + 'user');
  }
  return userWithoutPass(foundUser);
}

export async function searchUsers(
  email: string,
  name: string,
  surname: string,
) {
  const users = await UserModel.find({
    username: {$regex: email},
    name: {$regex: name},
    surname: {$regex: surname},
  }).limit(20);
  return users.map((user) => userWithoutPass(user));
}
