import fs from 'fs'
import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: String,
    stock: Number,
});

export const ProductModel = mongoose.model('Product', productSchema);

export class ProductManager {
    async getProducts(reqQuery) {
        try {
            const limit = parseInt(reqQuery.limit) || 10;
            const page = parseInt(reqQuery.page) || 1;
            const sort = reqQuery.sort || 'asc';
            const query = reqQuery.query || '';

            const filter = query ? { title: { $regex: new RegExp(query, 'i') } } : {};

            const products = await ProductModel.find(filter)
                .sort({ price: sort === 'asc' ? 1 : -1 })
                .skip((page - 1) * limit)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(filter);
            const totalPages = Math.ceil(totalProducts / limit);

            const response = {
                status: 'success',
                payload: products,
                totalPages,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
                page,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };

            return response;
        } catch (error) {
            console.log(error);
            return { status: 'error', error: 'Error interno del servidor' };
        }
    }

    async getProductsById(id) {
        try {
            return await ProductModel.findById(id);
        } catch (error) {
            console.log(error);
            return { status: 'error', error: 'Error interno del servidor' };
        }
    }

    async addProduct(product) {
        try {
            const newProduct = new ProductModel(product);
            await newProduct.save();
            return 'Producto agregado correctamente';
        } catch (error) {
            console.log(error);
            return { status: 'error', error: 'Error interno del servidor' };
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

