import fs from 'fs';

export class CartManager {
    constructor(path) {
        this.path = path
        this.carts = [];
        if (fs.existsSync(this.path)) {
            try {
                console.log("existe");
                const cartsData = fs.readFileSync(this.path, 'utf-8');
                this.carts = JSON.parse(cartsData);
            } catch (error) {
                console.log(error);
            }

        }
    }


    //---------------------------------------------------------------------------------------
    getCart = async () => {
        try {
            return this.carts
        } catch (error) {
            console.log(error);
        }

    };


    //--------------------------------------------------------------------------------------
    createCart = async () => {
        try {
            const carts = await this.getCart();
            const newCart = {
                id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
                products: [],
            };
            carts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
            return newCart;
        } catch (error) {
            console.log(error);
        }

    };


    //----------------------------------------------------------------------------------
    getCartById = async (cartId) => {
        try {
            const carts = await this.getCart();
            return carts.find(cart => cart.id === cartId);
        } catch (error) {
            console.log(error);
        }

    };


    //-----------------------------------------------------------------------------------------------
    addProductToCart = async (cartId, productId, quantity) => {
        try {
            const carts = await this.getCart();
            const cartIndex = carts.findIndex(cart => cart.id === cartId);

            if (cartIndex !== -1) {
                const cart = carts[cartIndex];
                const existingProductIndex = cart.products.findIndex(product => product.id === productId);

                if (existingProductIndex !== -1) {
                    cart.products[existingProductIndex].quantity += quantity;
                } else {
                    cart.products.push({ id: productId, quantity });
                }

                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
                return cart;
            }

            return null;
        } catch (error) {
            console.log(error);
        }

    };
}

