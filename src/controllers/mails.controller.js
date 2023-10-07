import ticketsController from '../controllers/tickets.controller.js';
import nodemailer from 'nodemailer';
import environment from '../config/environment.js';
import usersController from './users.controller.js';
import { logger } from '../middleware/logger.middleware.js';
import { generateJWTToken } from '../config/passport.config.js';
import bcrypt from 'bcrypt';
import { hashPassword } from '../utils/encrypt.utils.js';
import Swal from 'sweetalert2';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: environment.EMAIL,
        pass: environment.EMAIL_PASSWORD,
    },
})

export default class MailsController {
    async createMail(req, res) {
        let ticketId = req.params.tid;
        try {
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

            res.status(201).send({ status: "success", payload: ticket });
        } catch (err) {
            req.logger.error(`Error information: ${err}`);
            res.status(500).send({ status: "error", error: err })
        }
    }

    async restorePasswordMail(req, res) {
        let userEmail = req.params.userEmail;
        try {
            let user = await usersController.getUserByEmail(userEmail);
            if (!user) {
                logger.error(`El usuario no existe: ${user}`);
            } else {
                let tokenParams = {
                    userId: user._id,
                    username: user.first_name,
                };
                let token = await generateJWTToken(tokenParams)
                const htmlContent = `
                                <h1>Restauración de contraseña</h1>
                                <p><strong>Hola,  ${user.first_name}. Hemos recibido tu solicitud de restauración de contraseña.</p>
                                <p><strong>Haz click en el siguiente enlace para restablecer tu contraseña</strong></p>
                                <p><a href="${environment.BASE_URL}:${environment.PORT}/restore-password/uid/${user._id}/token/${token}" style="text-decoration: none; background-color: #007bff; color: #fff; padding: 5px 10px; border-radius: 5px;">Restaurar contraseña</a></p>
                                <p><strong>Si no realizaste esta solicitud, puedes ignorar este correo.</p>                             
                            `;
                const mailOptions = {
                    from: `UpSoon Ecommerce <${environment.EMAIL}>`,
                    to: environment.EMAIL, //TODO: cambiar por user mail
                    // to: user.EMAIL, 
                    subject: 'UpSoon - Restauración de contraseña',
                    html: htmlContent,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        logger.error(`Error information: ${error}`);
                    }
                    logger.info('Email sent: ' + info.response);
                });
            }
            res.status(201).send({ status: "success", payload: user });
        } catch (err) {
            req.logger.error(`Error information: ${err}`);
            res.status(500).send({ status: "error", error: err })
        }
    }

    async restorePassword(req, res) {
        let { password } = req.body;
        let userId = req.params.userId;        
        try {
            let user = await usersController.getUserById(userId);
            if (bcrypt.compareSync(password, user.password)) {
                req.logger.error(`No se puede utilizar la misma contraseña`);
            } else {
                const hashedPassword = hashPassword(password);
                let newUser = {
                    password: hashedPassword,
                }
                user = await usersController.updateUser(userId, newUser);
            }
            res.redirect('/login');
        } catch (err) {
            req.logger.error(`Error information: ${err}`);
            res.redirect('/loginError');
        }
    }
    
}