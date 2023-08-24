import { Router } from 'express';
import mailsController from '../controllers/mails.controller.js';

const mailsRouter = Router();

mailsRouter.get("/ticket/:tid", async (req, res) => {
    let ticketId = req.params.tid;
    try {
        let mail = await mailsController.createMail(ticketId);
        
        res.status(201).send({ status: "success", payload: mail });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

mailsRouter.post("/:userEmail", async (req, res) => {
    let email = req.params.userEmail;
    try {
        let emailSent = await mailsController.restorePasswordMail(email);        
        res.status(201).send({ status: "success", payload: emailSent });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});
mailsRouter.get("/restore-password/email/:email/psw/:psw", async (req, res) => {
    let email = req.params.email;
    let psw = req.params.psw;
    try {
        req.logger.info(`Email: ${email}`);
        req.logger.info(`Password: ${psw}`);
        // let emailSent = await mailsController.restorePasswordMail(email);        
        res.status(201).send({ status: "success", payload: email });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

export { mailsRouter };