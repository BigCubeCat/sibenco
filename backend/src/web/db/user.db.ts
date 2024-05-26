import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const saltRounds = 8;

export type TRole = 'admin' | 'driver' | 'employee' | 'axo';

export interface IUserDoc {
  email: string;
  name: string;
  surname: string;
  lastname: string;
  password: string;
  role: TRole;
  /*
   admin - Администратор
   driver - Представитель транспортной компании
   axo - специалист АХО
   employee - ответственный сотрудник
   */
}

export interface I_UserDocument extends IUserDoc, mongoose.Document {}

const UserSchema: mongoose.Schema<I_UserDocument> = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    unique: false,
    required: true,
    minlength: 2,
    maxlength: 1500,
  },
  surname: {
    type: String,
    unique: false,
    required: true,
    minlength: 2,
    maxlength: 1500,
  },
  lastname: {
    type: String,
    unique: false,
    required: true,
    minLength: 2,
    maxlength: 1500,
  },
  role: {
    type: String,
    unique: false, //TO_DO role validation
    required: true,
  },
  password: {
    type: String,
    unique: false,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
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

const UserDb = mongoose.model<I_UserDocument>('User', UserSchema);
export default UserDb;
