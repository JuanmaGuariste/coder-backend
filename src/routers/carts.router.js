import { Router } from 'express';
import CartController from '../controllers/CartController.js';
import ProductController from '../controllers/ProductController.js';

const cartController = new CartController("./carts.json");
const productController = new ProductController("./products.json");
const cartsRouter = Router();

cartsRouter.post("/", async (req, res) => {
    try {
        await cartController.addCart();
        res.send({ status: "succes", payload: "Se agregó con éxito" });
    } catch (err) {
        res.status(400).send({ status: "error", error: "Ocurrió un error" })
    }
})

cartsRouter.get("/:cid", async (req, res) => {
    try {
        let id = Number(req.params.cid)
        let cart = await cartController.getCartById(id);
        if (!cart) {
            res.status(400).send({ status: "error", error: `ID de carrito ${id} inexistente` })
        } else {
            res.send({ status: "succes", payload: cart });
        }
    } catch (err) {
        res.status(400).send({ status: "error", error: "Ocurrió un error" })
    }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    try {
        let cid = Number(req.params.cid)
        let pid = Number(req.params.pid)
        let product = await productController.getProductById(pid);
        if (!product) {
            res.status(400).send({ status: "error", error: `ID producto ${pid} inexistente` })
        } else {
            await cartController.addProductToCart(pid, cid);
            res.send({ status: "succes", payload: product });
        }
    } catch (err) {
        res.status(400).send({ status: "error", error: "Ocurrió un error" })
    }
});

export { cartsRouter };

