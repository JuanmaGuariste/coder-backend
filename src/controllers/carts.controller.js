import CartsService from '../services/carts.service.js';
import cartDAO from '../dao/mongo/CartDAO.js';

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
    async addProductToCart(pid, cid) {
        return await this.service.addProductToCart(pid, cid);
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