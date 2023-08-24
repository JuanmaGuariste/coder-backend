import cluster from 'cluster';
import os from 'os';
import { Server } from 'socket.io';
import productsController from './controllers/products.controller.js';
import chatsController from './controllers/chats.controller.js';
import { logger } from './middleware/logger.middleware.js';

if (cluster.isPrimary) {
    logger.info(`Primary ${process.pid} is running`);
    const cpuCount = os.cpus().length;
    // for (let i = 0; i < cpuCount; i++) {        
    for (let i = 0; i < 1; i++) {        
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        logger.error(`Worker ${worker.process.pid} died - ${signal || code}`);
        cluster.fork();
    })
} else {
    logger.info(`Worker ${process.pid} started`);
    import('./config/environment.js')
        .then((module) => {
            const environment = module.default;

            import("./app.js")
                .then((module) => {
                    const app = module.default;
                    const webServer = app.listen(environment.PORT, () => {
                        logger.info(`Escuchando puerto ${environment.PORT}`);
                    });

                    const io = new Server(webServer);
                    let totalProducts = [];
                    let messages = [];
                    io.on('connection', async (socket) => {
                        try {
                            totalProducts = await productsController.getAllProducts()
                            messages = await chatsController.getAllMessages()
                        } catch (err) {
                            logger.error(`${new Date().toISOString()} - Error information: ${err}`);
                        }
                        logger.info('Nuevo cliente conectado!');

                        socket.emit('totalProducts', totalProducts);

                        socket.on('new-product', async (product) => {
                            try {
                                await productsController.addProduct(product)
                                totalProducts = await productsController.getAllProducts()
                            } catch (err) {
                                logger.error(err)
                            }
                            io.emit('totalProducts', totalProducts);
                        });

                        socket.on('delete-product', async (prodId) => {
                            try {
                                await productsController.deleteProduct(prodId)
                                totalProducts = await productsController.getAllProducts()
                            } catch (err) {
                                logger.error(err)
                            }
                            io.emit('totalProducts', totalProducts);
                        });

                        socket.emit('messages', messages);

                        socket.on('message', async (message) => {
                            await chatsController.addMessage(message)
                            messages = await chatsController.getAllMessages()
                            io.emit('messages', messages);
                        });

                        socket.on('sayhello', (data) => {
                            socket.broadcast.emit('connected', data);
                        });
                    });
                })
        })

}