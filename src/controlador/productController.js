import fs from 'fs'

export class ProductManager {
    constructor(path) {
        this.path = path
        this.products = [];
        if (fs.existsSync(this.path)) {
            try {
                console.log("existe");
                const productsData = fs.readFileSync(this.path, 'utf-8');
                this.products = JSON.parse(productsData);
            } catch (error) {
                console.log(error);
            }

        }
    }
    //------------------------------------------------------------------------------------------
    async getProducts() {
        try {
            return this.products;
        } catch (error) {
            console.log(error);
        }

    }
    //----------------------------------------------------------------------------------------------
    async getProductsById(id) {
        try {
            const products = await this.getProducts()
            return products.find(product => product.id === id);
        } catch (error) {
            console.log(error);
        }

    }
    //-------------------------------------------------------------------------------------------------
    async addProduct(product) {
        try {
            const { title, description, price, thumbnail, code, stock } = product;
            const products = await this.getProducts()
            console.log("products", typeof (products));
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                return console.log("Todos los campos son obligatorios");
            }

            if (products.some(existingProduct => existingProduct.code === code)) {
                return console.log("El código de producto ya existe");
            }

            if (products.length > 0) {
                const lastProduct = products[products.length - 1];
                product.id = lastProduct.id + 1;
            } else {
                product.id = 1;
            }

            products.push(product);

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
            return "Producto agregado correctamente"
        } catch (error) {
            console.log(error);
        }

    }
}
//--------------------------------------------------------------------------------------------
export class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

