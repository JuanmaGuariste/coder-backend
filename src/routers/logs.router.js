import { Router } from 'express';

const logsRouter = Router();

logsRouter.get('/', async (req, res) => {
    try {
        req.logger.fatal(`${new Date().toISOString()} - Fatal error information`);
        req.logger.error(`${new Date().toISOString()} -  Error information`);
        req.logger.warn(`${new Date().toISOString()} -  Warning information`);
        req.logger.info(`${new Date().toISOString()} -  Information`);
        req.logger.http(`${new Date().toISOString()} -  HTTP information`);
        req.logger.debug(`${new Date().toISOString()} -  Debug information`);
        res.status(201).send({ status: "success", payload: true })
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

export { logsRouter };