"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadConfig = exports.config = void 0;
exports.config = {
    PORT: 0,
    MONGO_URL: '',
    JWT_SECRET: "JWT_SECRET",
    PAGE_SIZE: 30,
    admin: {
        email: 'admin@mail.ru',
        password: '123',
    },
};
function LoadConfig() {
    const port = process.env.PORT ? Number(process.env.PORT) : 5000;
    const url = process.env.MONGO_URL
        ? process.env.MONGO_URL
        : 'mongodb://root:toor@127.0.0.1:27017';
    exports.config.PORT = port;
    exports.config.MONGO_URL = url;
}
exports.LoadConfig = LoadConfig;
