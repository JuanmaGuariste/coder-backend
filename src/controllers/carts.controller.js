import CartsService from '../services/carts.service.js';
import cartDAO from '../dao/mongo/CartDAO.js';

class CartsController {
	constructor() {
		this.service = new CartsService(cartDAO);
	}

	getCarts() {
		return this.service.getCarts();
	}

	addCart() {
		return this.service.addCart();
	}
    addProductToCart(pid, cid) {
        return this.service.addProductToCart(pid, cid);
    }

    deleteProductFromCart(pid, cid) {
        return this.service.deleteProductFromCart(pid, cid);
    }

    deleteCartContent(cid) {
        return this.service.deleteCartContent(cid);
    }

    updateProductInCart(pid, cid, newCant ) {
        return this.service.updateProductInCart(pid, cid, newCant);
    }

	getCartById(id) {
		return this.service.getCartById(id);
	}
	deleteCart(id) {
		return this.service.deleteCart(id);
	}

	updateCart(id, cart) {
		return this.service.updateCart(id, cart);
	}
}

const cartsController = new CartsController();

export default cartsController;