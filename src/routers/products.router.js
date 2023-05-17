import { Router } from 'express';
import ProductController from '../controllers/ProductController.js';

const productController = new ProductController("./products.json");
const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
    try {
        let limit = req.query.limit;
        let allProducts = await productController.getProducts();
        if (!limit) {
            res.send({ status: "succes", payload: allProducts });
        } else {
            const totalProducts = allProducts.slice(0, limit)
            res.send({ status: "succes", payload: totalProducts });
        }
    } catch (err) {
        res.status(400).send({ status: "error", error: "Ocurrió un error" })
    }
})

productsRouter.get("/:pid", async (req, res) => {
    try {
        let id = Number(req.params.pid)
        let product = await productController.getProductById(id);
        if (!product) {
            res.status(400).send({ status: "error", error: `El producto no existe`})            
        } else {
            res.send({ status: "succes", payload: product });
        }
    } catch (err) {
        res.status(400).send({ status: "error", error: "Ocurrió un error" })
    }
});

productsRouter.post('/', async (req, res) => {
    try {
        let prodComplete = await productController.addProduct(req.body);
        if (prodComplete) {
            res.send({ status: "succes", payload: req.body });
        } else {
            res.status(400).send({ status: "error", error: "Es necesario completar todos los campos del producto" })
        }
    } catch (err) {
        res.status(400).send({ status: "error", error: "Ocurrió un error" })
    }
});

productsRouter.put('/:pid', async (req, res) => {
    try {
        let id = Number(req.params.pid);
        let prodUpdated = await productController.updateProduct(id, req.body);
        if (prodUpdated) {
            res.send({ status: "succes", payload: req.body });
        } else {
            res.status(400).send({ status: "error", error: `Error: El producto con ID ${id} no existe.` })
        }
    } catch (err) {
        res.status(400).send({ status: "error", error: "Ocurrió un error" })
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        let id = Number(req.params.pid);
        let existProduct = await productController.deleteProduct(id);
        if (existProduct) {
            res.send({ status: "succes", payload: id });
        } else {
            res.status(400).send({ status: "error", error: `Error: El producto con ID ${id} no existe.` })
        }
    } catch (err) {
        res.status(400).send({ status: "error", error: "Ocurrió un error" })
    }
});

export { productsRouter };