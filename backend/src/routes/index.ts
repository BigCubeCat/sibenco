import express from 'express';
import sendEmail from '../mailer';

const router = express.Router();

router.get('/', function (req, res, next) {
  sendEmail();
  res.send('Hello World');
});

export default router;
