import productModel from "./models/products.model.js";

class ProductDAO {
    constructor() {
        this.model = productModel;
    }

    async getAll() {
        return await this.model.find().lean();
    }

    async getProductById(pid) {
        return await this.model.findOne({ _id: pid });
    }

    async addProduct(product) {
        return await this.model.create(product);
    }

    async updateProduct(pid, product) {
        if (!pid) {
            throw new Error('Missing required fields');
        }
        return await this.model.updateOne({ _id: pid }, product);
    }

    async deleteProduct(pid) {
        if (!pid) {
            throw new Error('Missing required fields');
        }
        return await this.model.deleteOne({ _id: pid });
    }
}

const productDAO = new ProductDAO();

export default productDAO;