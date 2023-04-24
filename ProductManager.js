const fs = require('fs');
const FAIL = 0;

class ProductManager {
    #id = 0;

    constructor(path) {
        this.path = path;
        fs.promises.writeFile(this.path, JSON.stringify([]));
    }

    /**
     * Permite agregar un producto persistente
     * @param {object} product Producto a agregar un producto al array
     */
    async addProduct(product) {
        const {tittle, description, price, thumbnail, code, stock} = product;

        if (!tittle || !description || !price || !thumbnail || !code || !stock) {
            console.log("Error: Para agregar el producto debe completar todos los campos: tittle; description; price; thumbnail; code y stock.");
            return FAIL;
        }

        try {
            const actualProducts = await this.getProducts();
            const productIndex = actualProducts.findIndex(
                (prod) => prod.code === code
            );

            if (!(productIndex === -1)) {
                console.log('');
                console.log(`Error: El producto con código "${code}" ya existe.`);
                return FAIL;
            }

            actualProducts.push(product);
            product.id = this.#getID();

            await fs.promises.writeFile(
                this.path,
                JSON.stringify(actualProducts)
            );

        } catch (err) {
            console.log('Error: No se pudo agregar el producto');
        }
    }

    #getID() {
        this.#id++;
        return this.#id;
    }

    async getProducts() {
        try {
            const actualProducts = await fs.promises.readFile(
                this.path,
                'utf-8'
            );
            return JSON.parse(actualProducts);
        } catch (err) {
            console.log('Error: No es posible obtener los productos');
        }
    }

    async getProductById(idProduct) {
        try {
            const actualProducts = JSON.parse(await fs.promises.readFile(
                this.path,
                'utf-8'
            ));

            const productIndex = actualProducts.findIndex(
                (prod) => prod.id === idProduct
            );

            if (productIndex === -1) {
                console.log(`Error: El producto con ID "${idProduct}" no existe.`);
                return FAIL;
            }

            const product = actualProducts[productIndex];
            return product;

        } catch (err) {
            console.log('Error: No es posible obtener el producto buscado por ID.');
        }
    }

    async updateProduct(idProduct, updatedProduct) {
        try {
            const actualProducts = JSON.parse(await fs.promises.readFile(
                this.path,
                'utf-8'
            ));

            const productIndex = actualProducts.findIndex(
                (prod) => prod.id === idProduct
            );

            if (productIndex === -1) {
                console.log(`Error: El producto con ID "${idProduct}" no existe.`);
                return FAIL;
            }

            const newProduct = {
                ...actualProducts[productIndex],
                ...updatedProduct
            };

            actualProducts[productIndex] = newProduct;
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(actualProducts)
            );
            return actualProducts;

        } catch (err) {
            console.log('Error: No pude actualizar el producto.');
        }
    }

    async deleteProduct(idProduct) {
        try {
            const actualProducts = JSON.parse(await fs.promises.readFile(
                this.path,
                'utf-8'
            ));

            const productIndex = actualProducts.findIndex(
                (prod) => prod.id === idProduct
            );

            if (productIndex === -1) {
                console.log(`Error: El producto con ID "${idProduct}" no existe.`);
                return FAIL;
            }

            const filteredProducts = actualProducts.filter((prod) => {
                return prod.id != idProduct;
            })

            await fs.promises.writeFile(
                this.path,
                JSON.stringify(filteredProducts)
            );

            return filteredProducts;

        } catch (err) {
            console.log('Error: No puedo eliminar el producto.');
        }

    }
}

/*------------------------------------Testing----------------------------------------------*/

// Creación de instancia de ProductManager
const pm = new ProductManager("./products.json");
const test = async () => {
    try {
        //Llamado a getProducts() con la instancia recién creada
        console.log(await pm.getProducts());
        //Llamado al método "addProduct" para agregar diferentes productos
        await pm.addProduct({
            tittle: "mate",
            description: "verde",
            price: 1500,
            thumbnail: "sin imagen",
            code: "abc123",
            stock: 150,
        });
        await pm.addProduct({
            tittle: "parlante",
            description: "azul",
            price: 2900,
            thumbnail: "sin imagen",
            code: "afg121",
            stock: 36,
        });
        await pm.addProduct({
            tittle: "cinta",
            description: "naranja",
            price: 5260,
            thumbnail: "sin imagen",
            code: "aasdad",
            stock: 4,
        });
        //Llamado a getProducts() con la instancia recién creada
        console.log(await pm.getProducts());
        // //Busco un producto por ID con éxito
        console.log(await pm.getProductById(2));
        // //Busco un producto por ID con fallo
        console.log(await pm.getProductById(6));
        //Actualización de los campos descripción y stock del producto con ID 1
        console.log(await pm.updateProduct(1, {
            description: "azul",
            stock: 300,
        }));
        //Actualización de los campos descripción y stock del producto con ID no existente
        console.log(await pm.updateProduct(7, {
            description: "verde",
            price: 6000,
            stock: 1,
        }));
        // Elimino producto con ID = 3
        console.log(await pm.deleteProduct(2));
        // Elimino producto con ID no existente
        console.log(await pm.deleteProduct(8));
    } catch (err) {
        // Si hay error imprimo el error en consola
        console.log('Error: El test no se pudo realizar con éxito');
    }
};

test();