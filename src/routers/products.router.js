import { Router } from 'express';
import productDAO from '../dao/ProductDAO.js';

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
    const { limit, page, category, status, sort } = req.query;
    try {
        let product = await productDAO.getAllProducts(limit, page, category, status, sort);
        res.status(201).send({ status: "success", payload: product })
        //res.status(200).render('index', product);
    }
    catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

productsRouter.get('/:pid', async (req, res) => {
    let id = req.params.pid;
    try {
        const product = await productDAO.getProductById(id);
        res.status(201).send({ status: "success", payload: product })
    }
    catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
})

productsRouter.post('/', async (req, res) => {
    try {
        let prodComplete = await productDAO.addProduct(req.body);
        res.status(201).send({ status: "succes", payload: prodComplete });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

productsRouter.put('/:pid', async (req, res) => {
    let id = req.params.pid;
    try {
        let prodUpdated = await productDAO.updateProduct(id, req.body);
        res.status(201).send({ status: "succes", payload: prodUpdated });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        let id = req.params.pid;
        await productDAO.deleteProduct(id);
        res.status(201).send({ status: "succes", payload: id });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

export { productsRouter };