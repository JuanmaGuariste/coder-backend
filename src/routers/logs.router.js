import { Router } from 'express';

const logsRouter = Router();

logsRouter.get('/', async (req, res) => {
    try {
        req.logger.fetal(`Fatal error information`);
        req.logger.error(`Error information`);
        req.logger.warn(`Warning information`);
        req.logger.info(`Information`);
        req.logger.http(`HTTP information`);
        req.logger.debug(`Debug information`);
        // req.logger.error(`${new Date().toISOString()} - ${req.method} - ${req.url} - [${req.ip}] - ${req.get('user-agent')}`);
        res.status(201).send({ status: "success", payload: 1 })
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

export { logsRouter };