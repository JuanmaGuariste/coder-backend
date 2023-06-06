import { Router } from 'express';
import cartDAO from '../dao/CartDAO.js';

const cartsRouter = Router();

cartsRouter.post("/", async (req, res) => {
    try {
        let newCart = await cartDAO.addCart();
        res.status(201).send({ status: "success", payload: newCart });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
})

cartsRouter.get("/:cid", async (req, res) => {
    let id = req.params.cid
    try {
        let cart = await cartDAO.getCartById(id);
        res.status(201).send({ status: "success", payload: cart });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    let cid = req.params.cid;
    let pid = req.params.pid;
    try {
        let cart = await cartDAO.addProductToCart(pid, cid);
        res.status(201).send({ status: "succes", payload: cart });
    }
    catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

export { cartsRouter };

