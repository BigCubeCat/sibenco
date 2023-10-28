import nodemailer from 'nodemailer';
import HTML_TEMPLATE from './templates';
import {config} from '../../config';

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: false,
  auth: {
    user: config.mail.user,
    pass: config.mail.password,
  },
});

const sendTestMail = async (password: string, to: string) => {
  const result = await transporter.sendMail({
    from: '"Node js" <nodejs@example.com>',
    to: to,
    subject: 'Password',
    text: '',
    html: HTML_TEMPLATE(password),
  });

  console.log(result);
};

export default function sendMail(password: string, to: string) {
  const f = async () => {
    await sendTestMail(password, to);
  };
  f().catch(console.error);
}
