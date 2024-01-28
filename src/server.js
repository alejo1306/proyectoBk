
import express from 'express';
import productRoutes from './routes/productos.js';
import cartRoutes from './routes/cart.js';
import handlerbars from "express-handlebars"
import __dirname from './utils.js';
import { ProductManager, Product } from './controlador/productController.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import session from 'express-session'
import { UserModel } from './daos/models/UserModel.js';
import bcrypt from 'bcrypt';
import passport from 'passport';  // Importa passport directamente
import './config/passportConfig.js';
import LocalStrategy from 'passport-local';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = 8080;
const htttpServer = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const io = new Server(htttpServer)
//------------------------------------------------------
app.use(session(
    {
        secret: "aleSecret",
        resave: true,
        saveUninitialized: true
    }
))

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://sagel1306:28302983@clusterbk.yia5hgs.mongodb.net/?retryWrites=true&w=majority')

    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

app.engine(`hbs`, handlerbars.engine({
    extname: `hbs`,
    defaultLayout: `main`
}))

app.set("view engine", "hbs")
app.set("views", `${__dirname}/views`)

app.use(express.static(`${__dirname}/public`))


//--------------------------------------------------------------------------------------

//---------------------------------------------

const productManager = new ProductManager('./product.json');

io.on('connection', async (socket) => {
    console.log('A user connected');



    socket.on('createProduct', async (product) => {
        console.log("product", product);
        const prodAdd = await productManager.addProduct(product);

        const products = await productManager.getProducts()



        io.emit('updateProductList', products);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


//----------------------------------------------

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/', async (req, res) => {
    try {
        const productManager = new ProductManager('./product.json');
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
});

app.get('/realTimeProducts', async (req, res) => {
    try {
        const productManager = new ProductManager('./product.json');
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
});

