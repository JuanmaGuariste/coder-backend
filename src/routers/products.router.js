import { Router } from 'express';
import productsController from '../controllers/products.controller.js';
import { isValidProductDTO, isValidProductIdDTO } from '../dto/products.dto.js';
import { middlewarePassportJWT } from '../middleware/jwt.middleware.js';
import { emitter } from '../emiter.js';

const productsRouter = Router();

/**
 * @swagger
 * components:
*  schemas:
*    Product:
*        type: object
*        required:
*            - title
*            - description
*            - category
*            - price
*            - thumbnail
*            - code
*            - status
*            - stock
*        properties:
*            _id:
*                type: string
*                description: The auto-generated id of the product from the database
*            title:
*                type: string
*                description: The title of the product
*            description:
*                type: string
*                description: The description of the product
*            category:
*                type: string
*                description: The category of the product
*            price:
*                type: number
*                description: The price of the product
*            thumbnail:
*                type: string
*                description: The images of the product
*            code:
*                type: string
*                description: The code of the product. It has to be unique.
*            stock:
*                type: number
*                description: The stock of the product
*            status:
*                type: boolean
*                description: The status of the product
*            owner:
*                type: string
*                description: The owner of the product
*        example:
*            _id: 60f01dashtsd2224dqwidsdf2
*            title: "Celular Motorola"
*            description: "Celular Motorola 5G color negro de 256BG de almacenamiento interno y 8GB de RAM."
*            category: "Celulares"
*            price: 400000
*            thumbnail: "https://armoto.vtexassets.com/arquivos/ids/164305-1200-auto?v=638291943522970000&width=1200&height=auto&aspect=true"
*            code: 123
*            stock: 10
*            status: true
*            owner: 160f01dajkwrty224hnd2224dqwidsdf2*             
*/

/**
 * @swagger
 * tags:
 *    name: Products 
 *    description: The products managing API
 * api/products:
 *  get:
 *   summary: Returns a list of products
 *   tags: [Products]
 *   responses:
 *     200:
 *       description: The list of products
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Product'
 *     500:
 *       description: Some server error
 */
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

/**
 * @swagger
 * tags:
 *    name: Products
 *    description: The products managing API
 * 
 * api/products/{pid}:
 *  get:
 *   summary: Gets a product by id
 *   tags: [Products]
 *   parameters:
 *     - in: path
 *       name: pid
 *       schema:
 *        type: string
 *       required: true
 *   responses:
 *    200:
 *     description: The product was successfully retrieved
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Product'
 *    500:
 *     description: Some server error
 */
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

/** 
 * @swagger
 * tags:
 *    name: Products
 *    description: The products managing API
 * 
 * api/products:
 *  post:
 *   summary: Creates a new product
 *   tags: [Products]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Product'
 *   responses: 
 *    201:
 *     description: The product was successfully created
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Product'
 *    500:
 *     description: Some server error 
 */

productsRouter.post('/', async (req, res, next) => {
    try {
        const product = new isValidProductDTO(req.body)
        let prodComplete = await productsController.addProduct(product);
        emitter.emit('new-product', prodComplete);
        res.status(201).send({ status: "success", payload: prodComplete });
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * tags:
 *    name: Products
 *    description: The products managing API
 * 
 * api/products/{pid}:
 *  put:
 *   summary: Updates a product
 *   tags: [Products]
 *   parameters:
 *     - in: path
 *       name: pid
 *       schema: 
 *          type: string
 *       required: true
 *       description: The id of the product
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Product'
 *   responses:
 *    201:
 *     description: The product was successfully updated
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Product'
 *    500:
 *     description: Some server error
 * 
 */
productsRouter.put('/:pid', async (req, res, next) => {
    let id = req.params.pid;
    try {
        const pid = await isValidProductIdDTO(id)
        let prodUpdated = await productsController.updateProduct(pid, req.body);        
        res.status(201).send({ status: "success", payload: prodUpdated });
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * tags:
 *    name: Products
 *    description: The products managing API
 * 
 * api/products/{pid}:
 *  delete:
 *   summary: Deletes a product
 *   tags: [Products]
 *   parameters:
 *     - in: path
 *       name: pid
 *       schema: 
 *          type: string
 *       required: true
 *       description: The id of the product
 *   responses:
 *    201:
 *     description: The product was successfully deleted
 *    500:
 *     description: Some server error
 */
productsRouter.delete('/:pid', middlewarePassportJWT, async (req, res) => {
    let user = req.user
    let id = req.params.pid;
    try {
        let respuesta = await productsController.deleteProduct(id, user);
        emitter.emit('new-product', respuesta);
        res.status(201).send({ status: "success", payload: respuesta });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

export { productsRouter };