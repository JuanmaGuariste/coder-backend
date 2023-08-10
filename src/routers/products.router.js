import { Router } from 'express';
import productsController from '../controllers/products.controller.js';
import isValidProductDTO from '../dto/products.dto.js';

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
    const { limit, page, category, status, sort } = req.query;
    try {
        let product = await productsController.getProducts(limit, page, category, status, sort);
        res.status(201).send({ status: "success", payload: product })
    }
    catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

productsRouter.get('/:pid', async (req, res) => {
    let id = req.params.pid;
    try {
        const product = await productsController.getProductById(id);
        res.status(201).send({ status: "success", payload: product })
    }
    catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
})

productsRouter.post('/', async (req, res, next) => {
    try {
        const product = new isValidProductDTO(req.body)
        let prodComplete = await productsController.addProduct(product);
        res.status(201).send({ status: "succes", payload: prodComplete });
    } catch (err) {
        next(err);
    }
});

productsRouter.put('/:pid', async (req, res) => {
    let id = req.params.pid;
    try {
        let prodUpdated = await productsController.updateProduct(id, req.body);
        res.status(201).send({ status: "succes", payload: prodUpdated });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        let id = req.params.pid;
        let res = await productsController.deleteProduct(id);
        res.status(201).send({ status: "succes", payload: res });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

export { productsRouter };