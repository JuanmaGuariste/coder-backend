import express from 'express';
import handlerbars from 'express-handlebars';
import viewsRouter from './routers/views.router.js';
import { productsRouter } from './routers/products.router.js';
import { cartsRouter } from './routers/carts.router.js';
import { Server } from 'socket.io';
import ProductController from './controllers/ProductController.js';

const app = express();

const productController = new ProductController("./products.json");
let totalProducts = [];

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlerbars.engine());
app.set('views', 'views/');
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use('/', viewsRouter);
app.use('/realtimeproducts', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const webServer = app.listen(8080, () => {
	console.log('Escuchando 8080');
});

const io = new Server(webServer);

io.on('connection', async (socket) => {
	try{
		totalProducts = await productController.getProducts()
	} catch(err) {
		console.log(err)
	}
	console.log('Nuevo cliente conectado!');	
	socket.emit('totalProducts', totalProducts);

	socket.on('new-product', async (product) => {
		try{
			totalProducts = await productController.addProduct(product)
		} catch(err) {
			console.log(err)
		}
		io.emit('totalProducts', totalProducts);
	});
	
	socket.on('delete-product', async (prodId) => {
		try{
			totalProducts = await productController.deleteProduct(Number(prodId))
		} catch(err) {
			console.log(err)
		}
		io.emit('totalProducts', totalProducts);
	});
});