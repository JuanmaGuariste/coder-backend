import { Router } from 'express';
import { authToken } from '../middleware/jwt.middleware.js';

const sessionsRouter = Router();

sessionsRouter.get('/current', authToken, (req, res) => {
	let user = req.user
	res.status(201).send({ status: "success", user });	
});

export default sessionsRouter;