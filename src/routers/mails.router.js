import { Router } from 'express';
import mailsController from '../controllers/mails.controller.js';
import bcrypt from 'bcrypt';
import usersController from '../controllers/users.controller.js';
import { hashPassword } from '../utils/encrypt.utils.js';
import { logger } from '../middleware/logger.middleware.js';

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

mailsRouter.post("/restore-password/uid/:userId", async (req, res) => {
    let { password } = req.body;
    let userId = req.params.userId;
    try {
        let user = await usersController.getUserById(userId);
        if (bcrypt.compareSync(password, user.password)) {
            logger.error(`No se puede utilizar la misma contraseña`);
        } else {
            const hashedPassword = hashPassword(password);
            let newUser = {
                password: hashedPassword,
            }
            user = await usersController.updateUser(userId, newUser);
        }
        res.redirect('/login');
    } catch (err) {
        res.redirect('/registerError');
    }
});

export { mailsRouter };