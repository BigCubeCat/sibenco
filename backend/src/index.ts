import http from 'http';
import createError from 'http-errors';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { config, LoadConfig } from './config';
LoadConfig();

import indexRouter from "./routes/index";
import usersRouter from "./routes/userRouter";
import { createAdmin } from './service/user.service';


console.log(config.MONGO_URL)
mongoose.connect(config.MONGO_URL);
const fetchAdmin = async () => {
  await createAdmin();
}
fetchAdmin().catch(console.error);

const app = express();
app.use(cors());

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.set('port', config.PORT);

const server = http.createServer(app);
server.on('listening', onListening);
server.listen(config.PORT);

function onListening() {
  const addr = server.address();
  console.log('Listening on ', addr);
}
