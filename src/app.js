import express from 'express';
import handlerbars from 'express-handlebars';
import viewsRouter from './routers/views.router.js';
import { productsRouter } from './routers/products.router.js';
import { cartsRouter } from './routers/carts.router.js';
import userRouter from './routers/user.router.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import productsController from './controllers/products.controller.js';
import chatsController from './controllers/chats.controller.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import inicializePassport from './config/passport.config.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import sessionsRouter from './routers/sessions.router.js';
import enviroment from './config/enviroment.js';
import { mailsRouter } from './routers/mails.router.js';
import { mockingProductsRouter } from './routers/mockingproducts.router.js';
import { errorsManagerMiddleware } from './middleware/errorsManager.middleware.js';

const app = express();
let totalProducts = [];
let messages = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlerbars.engine());
app.set('views', 'views/');
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(cookieParser('B2zdY3B$pHmxW%'));
inicializePassport(app);

app.use(passport.initialize());

mongoose.connect(enviroment.MONGO_URL);

app.use(
	session({
		store: MongoStore.create({
			mongoUrl: enviroment.MONGO_URL,
			mongoOptions: {
				useNewUrlParser: true,
			},
			ttl: 6000,
		}),
		secret: 'B2zdY3B$pHmxW%',
		resave: true,
		saveUninitialized: true,
	})
);

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/user', userRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mails', mailsRouter);
app.use('/api/mockingproducts', mockingProductsRouter);
app.use(errorsManagerMiddleware);


const webServer = app.listen(enviroment.PORT, () => {
	console.log(`Escuchando puerto ${enviroment.PORT}`);
});
const io = new Server(webServer);

io.on('connection', async (socket) => {
	try {
		totalProducts = await productsController.getAllProducts()
		messages = await chatsController.getAllMessages()
	} catch (err) {
		console.log(err)
	}
	console.log('Nuevo cliente conectado!');
	socket.emit('totalProducts', totalProducts);

	socket.on('new-product', async (product) => {
		try {
			await productsController.addProduct(product)
			totalProducts = await productsController.getAllProducts()
		} catch (err) {
			console.log(err)
		}
		io.emit('totalProducts', totalProducts);
	});

	socket.on('delete-product', async (prodId) => {
		try {
			await productsController.deleteProduct(prodId)
			totalProducts = await productsController.getAllProducts()
		} catch (err) {
			console.log(err)
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