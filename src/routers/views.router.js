import { Router } from 'express';
import productDAO from '../dao/mongo/ProductDAO.js';
import cartDAO from '../dao/mongo/CartDAO.js';
import { middlewarePassportJWT } from '../middleware/jwt.middleware.js';

const viewsRouter = Router();

viewsRouter.get('/products', middlewarePassportJWT, async (req, res) => {
    const { limit, page, category, status, sort } = req.query;
    const user = req.user;
    try {

        let products = await productDAO.getAllProducts(limit, page, category, status, sort);
        res.render('products', {
            products,
            user,
        });
    }
    catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

viewsRouter.get("/carts/:cid", middlewarePassportJWT, async (req, res) => {
    let id = req.params.cid.replace(/^'|'$/g, '');   
    const user = req.user;
    try {
        let cart = await cartDAO.getCartById(id);
        res.render('carts',
            {
                title: 'Cart',
                cart,
                user,
            });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

viewsRouter.get('/realtimeproducts', middlewarePassportJWT, (req, res) => {
    const { user } = req.user;
    res.render('realTimeProducts', {
        user,
    });
});

viewsRouter.get('/chat', middlewarePassportJWT, (req, res) => {
    res.render('chat');
});

viewsRouter.get('/register', (req, res) => {
    res.render('register', {
        title: 'Registrar nuevo usuario',
    });
});
viewsRouter.get('/registerError', (req, res) => {
    res.render('registerError', {
        title: 'Error al registrar nuevo usuario',
    });
});
viewsRouter.get('/loginError', (req, res) => {
    res.render('loginError', {
        title: 'Error al iniciar sesión',
    });
});

viewsRouter.get('/login', (req, res) => {
    res.render('login', {
        title: 'Inicio de sesión',
    });
});

viewsRouter.get('/', middlewarePassportJWT, (req, res) => {

    if (!req.user) {
        res.render('login', {
            title: 'Inicio de sesión',
        });
    } else {
        res.redirect('/products');
    }
});

viewsRouter.get('/profile', middlewarePassportJWT, (req, res) => {

    res.render('profile', {
        title: 'Perfil de Usuario',
        user: req.user,
    });
});

export default viewsRouter;