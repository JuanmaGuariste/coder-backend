import { Router } from 'express';
import productsController from '../controllers/products.controller.js';
import CustomErrors from '../tools/CustomErrors.js';
import EErrors from '../tools/EErrors.js';
import { generateProductErrorInfo } from '../tools/info.js';

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
    const { title, description, category, price, thumbnail, code, stock, status } = req.body;
    try {
        if (!title || !description || !category || !price || !thumbnail || !code || !stock || !status) {
            CustomErrors.createError({
                name: "Product Creation Error",
                cause: generateProductErrorInfo(req.body),
                message: "Missing required fields",
                code: EErrors.INVALID_TYPE
            });
        }
        let prodComplete = await productsController.addProduct(req.body);
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