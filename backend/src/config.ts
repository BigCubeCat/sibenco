interface IConfig {
  PORT: number;
  MONGO_URL: string;
  JWT_SECRET: string;
  PAGE_SIZE: number;
  admin: {
    email: string;
    password: string;
  };
}

export const config: IConfig = {
  PORT: 0,
  MONGO_URL: '',
  JWT_SECRET: "JWT_SECRET",
  PAGE_SIZE: 30,
  admin: {
    email: 'admin@mail.ru',
    password: '123',
  },
};

export function LoadConfig() {
  const port = process.env.PORT ? Number(process.env.PORT) : 5000;
  const url = process.env.MONGO_URL
    ? process.env.MONGO_URL
    : 'mongodb://root:toor@127.0.0.1:27017';
  config.PORT = port;
  config.MONGO_URL = url;
}
