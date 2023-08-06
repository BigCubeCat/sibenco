import messages, {TMessages} from "./properties/messages";

interface IConfig {
  PORT: number;
  MONGO_URL: string;
  JWT_SECRET: string;
  PAGE_SIZE: number;
  admin: {
    email: string;
    password: string;
  };
  mail: {
    user: string;
    password: string;
    port: number;
    host: string;
  };
  messages: TMessages;
}

export const config: IConfig = {
  PORT: 0,
  MONGO_URL: '',
  JWT_SECRET: 'JWT_SECRET',
  PAGE_SIZE: 30,
  admin: {
    email: 'admin@mail.ru',
    password: '123',
  },
  mail: {
    user: '',
    password: '',
    host: '',
    port: 0,
  },
  messages: messages
};

export function LoadConfig() {
  const port = process.env.PORT ? Number(process.env.PORT) : 5000;
  const url = process.env.MONGO_URL
    ? process.env.MONGO_URL
    : 'mongodb://root:toor@127.0.0.1:27017';
  config.PORT = port;
  config.MONGO_URL = url;
  config.mail = {
    port: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 587,
    host: process.env.MAIL_HOST ? process.env.MAIL_HOST : 'smtp.mail.ru',
    user: process.env.MAIL_USER ? process.env.MAIL_USER : 'user@mail.ru',
    password: process.env.MAIL_PASS ? process.env.MAIL_PASS : 'qwerty1234',
  }
}
