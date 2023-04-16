class ProductManager {
    #id = 0;

    constructor() {
        this.products = [];
    }

    /**
     * Permite agregar un producto a la lista de productos
     * @param {string} tittle Nombre del producto
     * @param {string} description Descripción del producto
     * @param {number} price Precio del producto
     * @param {string} thumbnail Ruta de imagen del producto
     * @param {string} code Código de identificación del producto
     * @param {number} stock Número de piezas disponibles del producto
     */
    addProduct(tittle, description, price, thumbnail, code, stock) {
        const product = {
            tittle,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        const paramsProduct = Object.values(product);
        if (paramsProduct.includes(undefined)) {
            console.log("Error: Para agregar el producto debe completar todos los campos.");
            return;
        }

        const productIndex = this.products.findIndex(
            (prod) => prod.code === code
        );

        if (!(productIndex === -1)) {
            console.log('');
            console.log(`Error: El producto con código "${code}" ya existe.`);
            return;
        }

        product.id = this.#getID();
        this.products.push(product);
    }
    
    #getID() {
        this.#id++;
        return this.#id;
    }

    getProducts() {
        return this.products;
    }

    getProductById(idProduct) {
        const productIndex = this.products.findIndex(
            (prod) => prod.id === idProduct
        );

        if (productIndex === -1) {
            console.log(`Error: El producto con ID "${idProduct}" no existe.`);
            return;
        }

        const product = this.products[productIndex];
        console.log(`El producto es:`);
        console.log(product)
    }
}

/*------------------------------------Testing----------------------------------------------*/

// Creación de instancia de ProductManager
const pm = new ProductManager();
//Llamado a getProducts con la instancia recién creada
const prod1 = pm.getProducts()
console.log(prod1)
//Llamado al método "addProduct" para agregar diferentes productos
pm.addProduct("mate", "verde", 1500, "sin imagen", "abc123", 150);
pm.addProduct("parlante", "azul", 3000, "sin imagen", "ad32", 60);
pm.addProduct("vaso", "violeta", 800, "sin imagen", "gaf43", 700);
//Llamado a "getproducts" para visualizar los productos agregados
const prod2 = pm.getProducts()
console.log(prod2)
//intento agregar un producto repetido y llamo a "getproduct" para verificar que no se agregó
pm.addProduct("mate", "verde", 1500, "sin imagen", "abc123", 150);
const prod3 = pm.getProducts()
console.log(prod3)
//Busco un producto por ID con éxito
const prodID = pm.getProductById(2);
//Busco un producto por ID con fallo
const prodID2 = pm.getProductById(20);