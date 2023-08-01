"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const http_errors_1 = __importDefault(require("http-errors"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
(0, config_1.LoadConfig)();
const index_1 = __importDefault(require("./routes/index"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const routeRouter_1 = __importDefault(require("./routes/routeRouter"));
const user_service_1 = require("./service/user.service");
console.log(config_1.config.MONGO_URL);
mongoose_1.default.connect(config_1.config.MONGO_URL);
const fetchAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, user_service_1.createAdmin)();
});
fetchAdmin().catch(console.error);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/', index_1.default);
app.use('/routes', routeRouter_1.default);
app.use('/users', userRouter_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
app.set('port', config_1.config.PORT);
const server = http_1.default.createServer(app);
server.on('listening', onListening);
server.listen(config_1.config.PORT);
function onListening() {
    const addr = server.address();
    console.log('Listening on ', addr);
}
