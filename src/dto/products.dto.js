import CustomErrors from '../tools/CustomErrors.js';
import EErrors from '../tools/EErrors.js';
import { generateProductErrorInfo } from '../tools/info.js';

export default class isValidProductDTO {
    title;
    description;
    category;
    price;
    thumbnail;
    code;
    stock;
    status;

    constructor(product) {
        this.title = product.title;
        this.description = product.description;
        this.category = product.category;
        this.price = product.price;
        this.thumbnail = product.thumbnail;
        this.code = product.code;
        this.stock = product.stock;
        this.status = product.status;        

        if (!this.title || !this.description || !this.category || !this.price || !this.thumbnail || !this.code || !this.stock || !this.status) {
            throw CustomErrors.createError({
                name: "Product Creation Error",
                cause: generateProductErrorInfo(product),
                message: "Missing required fields",
                code: EErrors.INVALID_TYPE                
            });           
        }
    }
}
