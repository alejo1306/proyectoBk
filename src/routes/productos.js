
import { ProductManager } from '../controlador/productController.js';
import express from 'express';


const router = express.Router();

const productManager = new ProductManager();



router.get('/', async (req, res) => {
    try {
        const response = await productManager.getProducts(req.query);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductsById(productId);

        if (!product) {
            return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
        }

        res.json({ status: 'success', data: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, thumbnails, category } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ status: 'error', error: 'Todos los campos son obligatorios' });
        }

        const product = { title, description, code, price, stock, thumbnails, category };

        const result = await productManager.addProduct(product);

        if (result.status === 'error') {
            return res.status(500).json(result);
        }

        res.json({ status: 'success', data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

export default router;

