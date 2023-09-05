import { Router } from 'express';
import cartsController from '../controllers/carts.controller.js';
import ticketsController from '../controllers/tickets.controller.js';
import { middlewarePassportJWT } from '../middleware/jwt.middleware.js';

const cartsRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 description: ID del producto.
 *               cant:
 *                 type: integer
 *                 description: Cantidad de productos en el carrito.
 *       example:
 *         products:
 *           - product: 5f4e62a82c995f001c47f699
 *             cant: 2
 *           - product: 5f4e62a82c995f001c47f69a
 *             cant: 1               
 */

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: The carts managing API *
 * paths:
 *   /api/carts/{cid}:
 *     get:
 *       summary: Gets a cart by id
 *       tags: [Carts]
 *       parameters:
 *         - in: path
 *           name: cid
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         200:
 *           description: The cart was successfully retrieved
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Cart'
 *         500:
 *           description: Some server error
 */
cartsRouter.get("/:cid", async (req, res) => {
    let id = req.params.cid
    try {
        let cart = await cartsController.getCartById(id);
        res.status(201).send({ status: "success", payload: cart });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

/** 
 * @swagger
 * tags:
 *  name: Carts
 *  description: The carts managing API
 * 
 * api/carts:
 *   post:
 *     summary: Creates a new cart
 *     tags: [Carts]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:       
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       201:
 *         description: The cart was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Some server error
 *  
 */
cartsRouter.post("/", async (req, res) => {
    try {
        let newCart = await cartsController.addCart();
        res.status(201).send({ status: "success", payload: newCart });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
})

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: The carts managing API
 *
 * paths:
 *   /api/carts/{cid}/product/{pid}:
 *     post:
 *       summary: Adds a product to a cart
 *       tags: [Carts]
 *       parameters:
 *         - in: path
 *           name: cid
 *           schema:
 *             type: string
 *           required: true
 *         - in: path
 *           name: pid
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         201:
 *           description: The product was successfully added to the cart
 *         500:
 *           description: Some server error
 */

cartsRouter.post("/:cid/product/:pid", middlewarePassportJWT, async (req, res) => {
    let cid = req.params.cid;
    let pid = req.params.pid;
    let user = req.user;
    try {
        let cart = await cartsController.addProductToCart(pid, cid, user);
        if (!cart) {
            res.status(403).send({ status: "success", error: "Product owner" })
            return
        }
        res.status(201).send({ status: "success", payload: cart });
    }
    catch (err) {
        console.log("ERRORE", err)
        res.status(500).send({ status: "error", error: err })
    }
});

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: The carts managing API
 *
 * paths:
 *   /api/carts/{cid}/product/{pid}:
 *     delete:
 *       summary: Removes a product from a cart
 *       tags: [Carts]
 *       parameters:
 *         - in: path
 *           name: cid
 *           schema:
 *             type: string
 *           required: true
 *         - in: path
 *           name: pid
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         201:
 *           description: The product was successfully removed from the cart
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Cart'
 *         500:
 *           description: Some server error
 */

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

/** 
 * @swagger
 * tags:
 *  name: Carts
 *  description: The carts managing API
 * 
 * paths:
 *   /api/carts/{cid}:
 *     delete:
 *       summary: Deletes a cart
 *       tags: [Carts]
 *       parameters:
 *         - in: path
 *           name: cid
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         201:
 *           description: The cart was successfully deleted
 *         500:
 *           description: Some server error
 */
cartsRouter.delete("/:cid", async (req, res) => {
    let cid = req.params.cid;
    try {
        await cartsController.deleteCartContent(cid);
        res.status(201).send({ status: "success", payload: cid });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});


/** 
 * @swagger
 * tags:
 *  name: Carts
 *  description: The carts managing API
 * 
 * paths:
 *   /api/carts/{cid}:
 *     put:
 *       summary: Updates a cart
 *       tags: [Carts]
 *       parameters:
 *         - in: path
 *           name: cid
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         201:
 *           description: The cart was successfully updated
 *         500:
 *           description: Some server error
 */
cartsRouter.put("/:cid", async (req, res) => {
    let cid = req.params.cid;
    try {
        await cartsController.updateCart(cid, req.body);
        res.status(201).send({ status: "success", payload: cid });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

/** 
 * @swagger
 * tags:
 *  name: Carts
 *  description: The carts managing API
 * 
 * paths:
 *   /api/carts/{cid}/product/{pid}:
 *     put:
 *       summary: Updates a product in a cart
 *       tags: [Carts]
 *       parameters:
 *         - in: path
 *           name: cid
 *           schema:
 *             type: string
 *           required: true
 *         - in: path
 *           name: pid
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         201:
 *           description: The product was successfully updated
 *         500:
 *           description: Some server error
*/
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

/** 
 * @swagger
 * tags:
 *  name: Carts
 *  description: The carts managing API
 * 
 * paths:
 *   /api/carts/{cid}/purchase:
 *     post:
 *       summary: Purchase a cart
 *       tags: [Carts]
 *       parameters:
 *         - in: path
 *           name: cid
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         201:
 *           description: The cart was successfully purchased
 *         500:
 *           description: Some server error
 */
cartsRouter.post("/:cid/purchase",middlewarePassportJWT,  async (req, res) => {
    let cid = req.params.cid;
    const user = req.user   
    try {        
        let ticket = await ticketsController.addTicket(cid, user);
        res.status(201).send({ status: "success", payload: ticket });
    }
    catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

export { cartsRouter };

