import messages, {TMessages} from './web/properties/messages';
import errors, {TErrors} from './web/properties/errors';

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
  osrm: {
    url: string;
    accuracy: number;
  };
  redis: {
    url: string;
    password: string;
  }
  geocoder: {
    url: string;
  };

  // messages
  messages: TMessages;
  errors: TErrors;
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
  osrm: {
    url: 'http://127.0.0.1:8080',
    accuracy: 100,
  },
  redis: {
    url: "redis://127.0.0.1:6379",
    password: "",
  },
  geocoder: {
    url: 'http://127.0.0.1:8000/',
  },
  messages: messages,
  errors: errors,
};

export function LoadConfig() {
  const changeConf = (value: string | undefined, defaultValue: string) => value ? value : defaultValue;

  const port = process.env.PORT ? Number(process.env.PORT) : 5000;
  const url = changeConf(process.env.MONGO_URL, 'mongodb://user:DY9687FH@127.0.0.1:27017/maindb');
  config.PORT = port;
  config.MONGO_URL = url;

  config.osrm.url = changeConf(process.env.OSRM_URL, config.osrm.url);
  config.osrm.accuracy = process.env.ACCURACY ? Number(process.env.ACCURACY) : config.osrm.accuracy;

  config.redis.url = process.env.REDIS_URI ? process.env.REDIS_URI : config.redis.url;
  config.redis.password = process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD : config.redis.password;
}

