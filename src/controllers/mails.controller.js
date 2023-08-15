import ticketsController from '../controllers/tickets.controller.js';
import nodemailer from 'nodemailer';
import environment from '../config/environment.js';

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
                            <!-- Puedes agregar más detalles del ticket aquí -->
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
}

const mailsController = new MailsController();

export default mailsController;