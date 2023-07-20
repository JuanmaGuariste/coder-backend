export default class CartsService {
	constructor(dao) {
		this.dao = dao;
	}

	getCarts() {
		return this.dao.getCarts();
	}

	addCart() {
		return this.dao.addCart();
	}

    addProductToCart(pid, cid) {
        return this.dao.addProductToCart(pid, cid);
    }

    deleteProductFromCart(pid, cid) {
        return this.dao.deleteProductFromCart(pid, cid);
    }

    deleteCartContent(cid) {
        return this.dao.deleteCartContent(cid);
    }

    updateProductInCart(pid, cid, newCant ) {
        return this.dao.updateProductInCart(pid, cid, newCant);
    }

	deleteCart(id) {
		return this.dao.deleteCart(id);
	}

	updateCart(id, cart) {
		return this.dao.updateCart(id, cart);
	}

	getCartById(id) {		
		return this.dao.getCartById(id);
	}
}