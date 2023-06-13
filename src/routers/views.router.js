import { Router } from 'express';
import productDAO from '../dao/ProductDAO.js';
import cartDAO from '../dao/CartDAO.js'

const viewsRouter = Router();

viewsRouter.get('/products', async (req, res) => {
    const { limit, page, category, status, sort } = req.query;
    try {
        let products = await productDAO.getAllProducts(limit, page, category, status, sort);
        res.render('products', products);
    }
    catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

viewsRouter.get("/carts/:cid", async (req, res) => {
    let id = req.params.cid
    try {
        let cart = await cartDAO.getCartById(id);
        res.render('carts', cart);
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

viewsRouter.get('/chat', (req, res) => {
    res.render('chat');
});

export default viewsRouter;