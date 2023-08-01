import { Router } from 'express';
import cartsController from '../controllers/carts.controller.js';
import ticketsController from '../controllers/tickets.controller.js';

const cartsRouter = Router();

cartsRouter.post("/", async (req, res) => {
    try {
        let newCart = await cartsController.addCart();
        res.status(201).send({ status: "success", payload: newCart });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
})

cartsRouter.get("/:cid", async (req, res) => {
    let id = req.params.cid
    try {
        let cart = await cartsController.getCartById(id);
        res.status(201).send({ status: "success", payload: cart });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

cartsRouter.post("/:cid/product/:pid",  async (req, res) => {
    let cid = req.params.cid;
    let pid = req.params.pid;
    try {
        let cart = await cartsController.addProductToCart(pid, cid);
        res.status(201).send({ status: "success", payload: cart });
    }
    catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

cartsRouter.delete("/:cid/product/:pid", async (req, res) => {
    let cid = req.params.cid;
    let pid = req.params.pid;
    try {
        await cartsController.deleteProductFromCart(pid, cid);
        res.status(201).send({ status: "success", payload: pid });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

cartsRouter.delete("/:cid", async (req, res) => {
    let cid = req.params.cid;
    try {
        await cartsController.deleteCartContent(cid);
        res.status(201).send({ status: "success", payload: cid });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

cartsRouter.put("/:cid", async (req, res) => {
    let cid = req.params.cid;
    try {
        await cartsController.updateCart(cid, req.body);
        res.status(201).send({ status: "success", payload: cid });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

cartsRouter.put("/:cid/product/:pid", async (req, res) => {
    let pid = req.params.pid;
    let cid = req.params.cid;
    let newCant = parseInt(req.body.cant)
    try {
        await cartsController.updateProductInCart(pid, cid, newCant);
        res.status(201).send({ status: "success", payload: cid });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

cartsRouter.post("/:cid/purchase",  async (req, res) => {
    let cid = req.params.cid;
    try {        
        let ticket = await ticketsController.addTicket(cid);
        res.status(201).send({ status: "success", payload: ticket });
    }
    catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

export { cartsRouter };

