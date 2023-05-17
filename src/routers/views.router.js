import { Router } from 'express';
import ProductController from '../controllers/ProductController.js';

const viewsRouter = Router();
const productController = new ProductController("./products.json");

viewsRouter.get('/', async (req, res) => {
	const product = await productController.getProducts();
	res.render('index', { product });
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
	res.render('realTimeProducts');
});

viewsRouter.get('/realtimeproducts', (req, res) => {
	res.render('realTimeProducts');	
});

export default viewsRouter;