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
    accuracy: 1000,
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
  const url = changeConf(process.env.MONGO_URL, 'mongodb://root:toor@127.0.0.1:27017');
  config.PORT = port;
  config.MONGO_URL = url;
  config.geocoder.url = changeConf(process.env.GEOWORD_URL, config.geocoder.url);
  config.osrm.url = changeConf(process.env.OSRM_URL, config.osrm.url);
  config.osrm.accuracy = process.env.ACCURACY ? Number(process.env.ACCURACY) : config.osrm.accuracy;
  config.mail = {
    port: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 587,
    host: changeConf(process.env.MAIL_HOST, 'smtp.mail.ru'),
    user: changeConf(process.env.MAIL_USER, 'user@mail.ru'),
    password: changeConf(process.env.MAIL_PASS, 'qwerty1234')
  };
}

