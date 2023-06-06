import fs from 'fs';
const FAIL = 0;

export default class ProductController {
    #id = 0;

    constructor(path) {
        this.path = path;
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify([]));
        } else {
            const actualProducts = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
            if (actualProducts.length > 0) {
                const lastProductId = Math.max(...actualProducts.map(prod => prod.id));
                this.#id = lastProductId;
            }
        }
    }

    /**
     * Permite agregar un producto persistente
     * @param {object} product Producto a agregar al array
     */
    async addProduct(product) {
        const { title, description, category, price, thumbnail, code, stock, status } = product;

        if (!title || !description || !category || !price || !thumbnail || !code || !stock || !status) {
            console.log("Error: Para agregar el producto debe completar todos los campos: title; description; category; price; thumbnail; code; stock y status.");
            return FAIL;
        }

        try {
            const actualProducts = await this.getProducts();
            const productIndex = actualProducts.findIndex(
                (prod) => prod.code === code
            );

            if (!(productIndex === -1)) {
                console.log(`Error: El producto con código "${code}" ya existe.`);
                return FAIL;
            }

            actualProducts.push(product);
            product.id = this.#getID();

            await fs.promises.writeFile(
                this.path,
                JSON.stringify(actualProducts)
            );

            return product

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
            console.log('Error: No se pudo eliminar el producto.');
        }
    }
}