import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const saltRounds = 8;

export interface IUserDoc {
  email: string;
  name: string;
  surname: string;
  lastname: string;
  password: string;
  role: string;
}

export interface I_UserDocument extends IUserDoc, mongoose.Document {}

const UserSchema: mongoose.Schema<I_UserDocument> = new mongoose.Schema({
  email: {type: String, unique: true},
  name: {type: String, unique: false},
  surname: {type: String, unique: false},
  lastname: {type: String, unique: false},
  role: {type: String, unique: false},
  password: {type: String, unique: false},
});

export async function generatePasswordHash(password: string) {
  return await bcrypt.hash(password, saltRounds);
}

UserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await generatePasswordHash(user.password);
  }
  next();
});

// return public user information
export function userWithoutPass(user: any) {
  // TODO user type
  console.log(typeof user);
  return {
    email: user.email,
    name: user.name,
    surname: user.surname,
    lastname: user.lastname,
    role: user.role,
  };
}

const UserModel = mongoose.model<I_UserDocument>('User', UserSchema);
export default UserModel;
