import { emitter } from '../emiter.js';
import { isValidProductDTO, isValidProductIdDTO } from '../dto/products.dto.js';
import productsService from '../services/products.service.js';

export default class ProductsController {
	constructor() {
		this.service = productsService;
	}

	async getProducts(req, res) {
		const { limit, page, category, status, sort } = req.query;
		try {
			let product = await this.service.getProducts(limit, page, category, status, sort);
			res.status(201).send({ status: "success", payload: product })
		}
		catch (err) {
			res.status(500).send({ status: "error", error: err })
		}
	}
	async getProductById(req, res) {
		let id = req.params.pid;
		try {
			const product = await this.service.getProductById(id);
			res.status(201).send({ status: "success", payload: product })
		}
		catch (err) {
			res.status(500).send({ status: "error", error: err })
		}
	}
	async getAllProducts() {
		return await this.service.getAllProducts();
	}

	async addProduct(req, res, next) {
		let user = req.user
		try {
			let product = req.body
			product.owner = user._id
			product = new isValidProductDTO(product)
			let prodComplete = await this.service.addProduct(product);
			console.log(prodComplete)
			emitter.emit('new-product', prodComplete);
			res.status(201).send({ status: "success", payload: prodComplete });
		} catch (err) {
			next(err);
		}
	}

	async deleteProduct(req, res) {
		let user = req.user
		let id = req.params.pid;
		try {

			let prod = await this.service.getProductById(id);
			let respuesta = false;
			if (user.rol == "admin") {
				respuesta = await this.service.deleteProduct(id);
				emitter.emit('new-product', respuesta);
			} else if ((user.rol == "premium") && (`${prod.owner}` === user._id)) {
				respuesta = await this.service.deleteProduct(id);
				emitter.emit('new-product', respuesta);
			} 
			res.status(201).send({ status: "success", payload: respuesta });
		} catch (err) {
			res.status(500).send({ status: "error", error: err })
		}
	}

	async deleteProduct2(id, user) {
		let prod = await this.service.getProductById(id);
		if (user.rol == "admin") {
			return await this.service.deleteProduct(id);
		} else if ((user.rol == "premium") && (`${prod.owner}` === user._id)) {
			return await this.service.deleteProduct(id);
		} else {
			return false
		}
	}
	async updateProduct(req, res, next) {
		let id = req.params.pid;
		try {
			const pid = await isValidProductIdDTO(id)
			let prodUpdated = await this.service.updateProduct(pid, req.body);
			res.status(201).send({ status: "success", payload: prodUpdated });
		} catch (err) {
			next(err);
		}
	}
}

const productsController = new ProductsController();