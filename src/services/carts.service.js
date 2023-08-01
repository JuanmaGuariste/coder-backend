export default class CartsService {
	constructor(dao) {
		this.dao = dao;
	}

	async getCarts() {
		return await this.dao.getCarts();
	}

	async addCart() {
		return await this.dao.addCart();
	}

    async addProductToCart(pid, cid) {
        return await this.dao.addProductToCart(pid, cid);
    }

    async deleteProductFromCart(pid, cid) {
        return await this.dao.deleteProductFromCart(pid, cid);
    }

    async deleteCartContent(cid) {
        return await this.dao.deleteCartContent(cid);
    }

    async updateProductInCart(pid, cid, newCant ) {
        return await this.dao.updateProductInCart(pid, cid, newCant);
    }

	async deleteCart(id) {
		return await this.dao.deleteCart(id);
	}

	async updateCart(id, cart) {
		return await this.dao.updateCart(id, cart);
	}

	async getCartById(id) {		
		return await this.dao.getCartById(id);
	}
}