import nodemailer from 'nodemailer';

export const sendNotificationEmail = async ({ to, userName, bookName, type }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const subject = type === 'loan'
    ? 'Tu préstamo ha sido aprobado'
    : 'Tu libro reservado está disponible';

  const html = `
    <h2>Hola ${userName}!</h2>
    <p>El libro <strong>${bookName}</strong> ${
      type === 'loan'
        ? 'ya ha sido prestado a tu nombre.'
        : 'ya está disponible para ti.'
    }</p>
    <p>Gracias por usar nuestra plataforma 📚</p>
  `;

  await transporter.sendMail({
    from: `"Biblioteca Virtual" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
