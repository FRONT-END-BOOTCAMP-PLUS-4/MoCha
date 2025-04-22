import nodemailer from 'nodemailer';

const EMAIL_USER = process.env.EMAIL_USER!;
const EMAIL_PASS = process.env.EMAIL_PASS!;
const EMAIL_FROM = process.env.EMAIL_FROM!;

export const sendVerificationCode = async (to: string, code: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: EMAIL_FROM,
    to,
    subject: '[MoCha] 회원가입 인증 코드',
    text: `인증 코드는 [${code}] 입니다.\n5분 안에 입력해주세요.`,
  };

  await transporter.sendMail(mailOptions);
};
