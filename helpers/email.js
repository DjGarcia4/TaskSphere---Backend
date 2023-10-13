import nodemailer from "nodemailer";

export const emailRegistration = async (data) => {
  const { email, name, token } = data;
  console.log(data);
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Mail information
  const info = await transport.sendMail({
    from: '"TaskShepere - Project Administrator"<cuentas@tasksphere.com>',
    to: email,
    subject: "TaskSphere - Verify your account",
    text: "Verify your account on TaskSphere",
    html: `
        <p>Hi: ${name} verify your account on TaskSphere.</p>
        <p>Your account is almost ready. You just need to verify it using the following link:</p>
        <a href="${process.env.FRONTEND_URL}/confirm/${token}">Verify Account</a>
        <p>If you did not create this account, you can ignore this message</p>
      `,
  });
};

export const emailForgetPassword = async (data) => {
  const { email, name, token } = data;
  console.log(data);
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Mail information
  const info = await transport.sendMail({
    from: '"TaskShepere - Project Administrator"<cuentas@tasksphere.com>',
    to: email,
    subject: "TaskSphere - Reset your password",
    text: "Reset your Password",
    html: `
        <p>Hi: ${name} you have requested to reset your password.</p>
        <p>Follow the link below to generate a new password:</p>
        <a href="${process.env.FRONTEND_URL}/forget-password/${token}">Reset your password</a>
        <p>If you didn't request this email, you can ignore the message</p>
      `,
  });
};
