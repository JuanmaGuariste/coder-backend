import cartsService from '../services/carts.service.js';

export default class CartsController {
	constructor() {
		this.service = cartsService;
	}
	
	async getCarts() {
		return await this.service.getCarts();
	}
	async addCart(req, res) {
		try {
			let newCart = await this.service.addCart();
			res.status(201).send({ status: "success", payload: newCart });
		} catch (err) {
			res.status(500).send({ status: "error", error: err })
		}
	}

	async addProductToCart (req, res) {
		let cid = req.params.cid;
		let pid = req.params.pid;
		let user = req.user;
		try {
			let product = await this.service.getProductById(pid);
			if(`${user._id}` === `${product.owner}`){
				return 0
			}
			let cart = await this.service.addProductToCart(pid, cid);
			if (!cart) {
				res.status(403).send({ status: "success", error: "Product owner" })
				return 0
			}
			res.status(201).send({ status: "success", payload: cart });
		}
		catch (err) {
			res.status(500).send({ status: "error", error: err })
		}
	}
    
	async deleteProductFromCart(req, res) {
		let cid = req.params.cid;
		let pid = req.params.pid;
		try {
			await this.service.deleteProductFromCart(pid, cid);
			res.status(201).send({ status: "success", payload: {"ProdID": pid} });
		} catch (err) {
			res.status(500).send({ status: "error", error: err })
		}
	}    
	async deleteCartContent(req, res) {
		let cid = req.params.cid;
		try {
			await this.service.deleteCartContent(cid);         
			res.status(201).send({ status: "success", payload: {"CartId": cid} });
		} catch (err) {
			res.status(500).send({ status: "error", error: err })
		}
	}
    
	async updateProductInCart(req, res) {
		let pid = req.params.pid;
		let cid = req.params.cid;
		let newCant = parseInt(req.body.cant)
		try {
			await this.service.updateProductInCart(pid, cid, newCant);
			res.status(201).send({ status: "success", payload: {"CartId": cid} });
		} catch (err) {
			res.status(500).send({ status: "error", error: err })
		}
	}   
	async getCartById(req, res) {
		let id = req.params.cid
		try {
			let cart = await this.service.getCartById(id);
			res.status(201).send({ status: "success", payload: cart });
		} catch (err) {
			res.status(500).send({ status: "error", error: err })
		}
	}

	async deleteCart(id) {
		return await this.service.deleteCart(id);
	}

	async updateCart(req, res) {
		let cid = req.params.cid;
		try {
			await this.service.updateCart(cid, req.body.products);
			res.status(201).send({ status: "success", payload: {"CartId": cid} });
		} catch (err) {
			res.status(500).send({ status: "error", error: err })
		}
	}

}