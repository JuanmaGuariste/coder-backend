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

export { mailsRouter };