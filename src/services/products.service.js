export default class ProductsService {
	constructor(dao) {
		this.dao = dao;
	}

	getProducts(limit, page, category, status, sort) {
		return this.dao.getProducts(limit, page, category, status, sort);
	}

	getAllProducts() {
        return this.dao.getAllProducts();
    }

	addProduct(product) {
		return this.dao.addProduct(product);
	}

	deleteProduct(id) {
		return this.dao.deleteProduct(id);
	}

	updateProduct(id, product) {
		return this.dao.updateProduct(id, product);
	}

	getProductById(id) {		
		return this.dao.getProductById(id);
	}
}
