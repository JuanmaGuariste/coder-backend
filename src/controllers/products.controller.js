import ProductsService from '../services/products.service.js';
import productDAO from '../dao/mongo/ProductDAO.js';

class ProductsController {
	constructor() {
		this.service = new ProductsService(productDAO);
	}

	async getProducts(limit, page, category, status, sort) {
		return await this.service.getProducts(limit, page, category, status, sort);
	}
	async getAllProducts() {
		return await this.service.getAllProducts();
	}

	async addProduct(product) {
		return await this.service.addProduct(product);
	}

	async getProductById(id) {
		return await this.service.getProductById(id);
	}
	async deleteProduct(id) {
		return await this.service.deleteProduct(id);
	}

	async updateProduct(id, product) {
		return await this.service.updateProduct(id, product);
	}
}

const productsController = new ProductsController();

export default productsController;