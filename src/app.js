import express from 'express';
import handlerbars from 'express-handlebars';
import viewsRouter from './routers/views.router.js';
import { productsRouter } from './routers/products.router.js';
import { cartsRouter } from './routers/carts.router.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import productDAO from './dao/ProductDAO.js';
import chatDAO from './dao/chatDAO.js';

const app = express();
let totalProducts = [];
let messages = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlerbars.engine());
app.set('views', 'views/');
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use('/', viewsRouter);
app.use('/chat', viewsRouter);
app.use('/realtimeproducts', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

mongoose.connect(
	'mongodb+srv://juanmaguariste:guaripsw@cluster0.d5w82e1.mongodb.net/?retryWrites=true&w=majority'
);

const webServer = app.listen(8080, () => {
	console.log('Escuchando 8080');
});

const io = new Server(webServer);

io.on('connection', async (socket) => {
	try {
		totalProducts = await productDAO.getAll()
		messages = await chatDAO.getAllMessages()
	} catch (err) {
		console.log(err)
	}
	console.log('Nuevo cliente conectado!');
	socket.emit('totalProducts', totalProducts);

	socket.on('new-product', async (product) => {
		try {
			await productDAO.addProduct(product)
			totalProducts = await productDAO.getAll()
		} catch (err) {
			console.log(err)
		}
		io.emit('totalProducts', totalProducts);
	});

	socket.on('delete-product', async (prodId) => {
		try {
			await productDAO.deleteProduct(prodId)
			totalProducts = await productDAO.getAll()
		} catch (err) {
			console.log(err)
		}
		io.emit('totalProducts', totalProducts);
	});

	socket.emit('messages', messages);

	socket.on('message', async (message) => {
		await chatDAO.addMessage(message)
		messages = await chatDAO.getAllMessages()
		io.emit('messages', messages);
	});

	socket.on('sayhello', (data) => {
		socket.broadcast.emit('connected', data);
	});
});