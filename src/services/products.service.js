import ProductRepository from "../repositories/products.repository.js";
import userDAO from "../dao/mongo/UserDAO.js";

const productsService = new ProductRepository(userDAO);

export default productsService