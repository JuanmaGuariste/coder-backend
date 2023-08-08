import { Router } from 'express';
import { generateProducts } from '../utils/generate.js';

const mockingProductsRouter = Router();

mockingProductsRouter.get('/', async (req, res) => {
    let mockingProducts = [];
    try {
        mockingProducts = generateProducts();
        res.status(201).send({ status: "success", payload: mockingProducts })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: "error", error: err })
    }
});

export { mockingProductsRouter };