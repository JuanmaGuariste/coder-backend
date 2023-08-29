import CartsService from '../services/carts.service.js';
import cartDAO from '../dao/mongo/CartDAO.js';
import productsController from './products.controller.js';
class CartsController {
	constructor() {
		this.service = new CartsService(cartDAO);
	}

	async getCarts() {
		return await this.service.getCarts();
	}

	async addCart() {
		return await this.service.addCart();
	}
    async addProductToCart(pid, cid, user) {
		try{
			let product = await productsController.getProductById(pid);
			if(`${user._id}` === `${product.owner}`){
				return 0
			}
			return await this.service.addProductToCart(pid, cid);
		} catch (err){
			console.log("ERRROOOORRR", err)
			req.logger.error(err)
		}
    }

    async deleteProductFromCart(pid, cid) {
        return await this.service.deleteProductFromCart(pid, cid);
    }

    async deleteCartContent(cid) {
        return await this.service.deleteCartContent(cid);
    }

    async updateProductInCart(pid, cid, newCant ) {
        return await this.service.updateProductInCart(pid, cid, newCant);
    }

	async getCartById(id) {
		return await this.service.getCartById(id);
	}
	async deleteCart(id) {
		return await this.service.deleteCart(id);
	}

	async updateCart(id, cart) {
		return await this.service.updateCart(id, cart);
	}
}

const cartsController = new CartsController();

export default cartsController;