import ticketsController from '../controllers/tickets.controller.js';
import nodemailer from 'nodemailer';
import environment from '../config/environment.js';
import usersController from './users.controller.js';
import { logger } from '../middleware/logger.middleware.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: environment.EMAIL,
        pass: environment.EMAIL_PASSWORD,
    },
})

class MailsController {

    async createMail(ticketId) {
        let ticket = await ticketsController.getTicketById(ticketId);
        const htmlContent = `
                            <h1>Detalles del Ticket</h1>
                            <p><strong>Código del Ticket:</strong> ${ticket.code}</p>
                            <p><strong>Fecha de Compra:</strong> ${ticket.purchase_datetime}</p>
                            <p><strong>Monto Total:</strong> ${ticket.amount}</p>
                            <p><strong>Comprador:</strong> ${ticket.purchaser}</p>
                        `;
        const mailOptions = {
            from: `UpSoon Ecommerce <${environment.EMAIL}>`,
            to: environment.EMAIL,
            subject: 'UpSoon - Ticket de compra',
            html: htmlContent,
            // attachments: [{
            //     filename: 'ticket.txt',
            //     content: htmlContent,
            // }],
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                req.logger.error(`Error information: ${error}`);
            }
            req.logger.info('Email sent: ' + info.response);
        });

        return ticket
    }
    async restorePasswordMail(userEmail) {
        let user = await usersController.getUserByEmail(userEmail);
        if (!user) {
            logger.error(`El usuario no existe: ${user}`);
        } else {
            const htmlContent = `
                                <h1>Restauración de contraseña</h1>
                                <p><strong>Hola,  ${user.first_name}. Hemos recibido tu solicitud de restauración de contraseña.</p>
                                <p><strong>Haz click en el siguiente enlace para restablecer tu contraseña</strong></p>
                               <p><a href="${environment.BASE_URL}:${environment.PORT}/api/mails/restore-password/email/${user.email}/psw/${user.password}" style="text-decoration: none; background-color: #007bff; color: #fff; padding: 5px 10px; border-radius: 5px;">Restaurar contraseña</a></p>
                               <p><strong>Si no realizaste esta solicitud, puedes ignorar este correo.</p>                             
                            `;
            const mailOptions = {
                from: `UpSoon Ecommerce <${environment.EMAIL}>`,
                to: environment.EMAIL,
                // to: userEmail,
                subject: 'UpSoon - Restauración de contraseña',
                html: htmlContent,
                // attachments: [{
                //     filename: 'ticket.txt',
                //     content: htmlContent,
                // }],
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    logger.error(`Error information: ${error}`);
                }
                logger.info('Email sent: ' + info.response);
            });
        }
        return user
    }
}

const mailsController = new MailsController();

export default mailsController;