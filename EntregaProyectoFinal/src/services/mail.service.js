import nodemailer from "nodemailer";
import configs from "../config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: configs.userNodemailer,
    pass: configs.passwordNodemailer,
  },
  secure: true,
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmail = async (email, type) => {
  let subject, message;
  if (type === "resetPassword") {
    subject = "Solicitud Para Restablecer Contraseña";
    message = `<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restablecer Contraseña</title>
    </head>
    <body>

        <div>
            <p>Haga clic en el siguiente botón para restablecer su contraseña:</p>
            <a href="http://localhost:8080/reset" style="text-decoration: none; color: white;">
                <button style="background-color: #007BFF; color: white; padding: 10px; border: none; cursor: pointer;">Restablecer Contraseña</button>
            </a>
        </div>
    </body>
    </html>`;
  } else if (type === "accountDeleted") {
    subject = "Su cuenta ha sido eliminada por inactividad";
    message =
      "Su cuenta ha sido eliminada por inactividad. Por favor, contacte al administrador para más información.";
  }

  await transporter.sendMail({
    from: configs.mailAdmin,
    to: email,
    subject,
    html: message,
    attachments: [],
  });
};
