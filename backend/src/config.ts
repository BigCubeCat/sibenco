interface IConfig {
  PORT: number;
  MONGO_URL: string;
}

export const config: IConfig = {
  PORT: 0,
  MONGO_URL: '',
};

export function LoadConfig() {
  const port = process.env.PORT ? Number(process.env.PORT) : 5000;
  const url = process.env.MONGO_URL
    ? process.env.MONGO_URL
    : 'mongo://root:toor@127.0.0.1:27017';
  config.PORT = port;
  config.MONGO_URL = url;
}
