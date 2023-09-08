import { Server } from 'socket.io';
import productsController from './controllers/products.controller.js';
import chatsController from './controllers/chats.controller.js';
import { logger } from './middleware/logger.middleware.js';

let io;
const socketio = async () => {
    return new Promise((resolve) => {
        import('./config/environment.js')
            .then((module) => {
                const environment = module.default;
                import("./app.js")
                    .then((module) => {
                        const app = module.default;
                        const webServer = app.listen(environment.PORT, () => {
                            logger.info(`Escuchando puerto ${environment.PORT}`);
                        });
                        io = new Server(webServer);
                        let totalProducts = [];
                        let messages = [];
                        io.on("connection", async (socket) => {
                            try {
                                totalProducts = await productsController.getAllProducts()
                                messages = await chatsController.getAllMessages()
                            } catch (err) {
                                logger.error(`${new Date().toISOString()} - Error information: ${err}`);
                            }
                            logger.info('Nuevo cliente conectado!');
                            socket.emit('totalProducts', JSON.stringify(totalProducts));
                            socket.on('new-product', async (product) => {
                                try {
                                    totalProducts = await productsController.getAllProducts()
                                } catch (err) {
                                    logger.error(err)
                                }
                                io.emit('totalProducts', JSON.stringify(totalProducts));
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
                        resolve(io);
                    });
            });
    })

}

export default {
    socketio
};