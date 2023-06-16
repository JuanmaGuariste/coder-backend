import { Router } from 'express';
import productDAO from '../dao/ProductDAO.js';
import cartDAO from '../dao/CartDAO.js'
import { isAuth, isGuest } from '../dao/middleware/auth.middleware.js';

const viewsRouter = Router();

viewsRouter.get('/products', isAuth, async (req, res) => {
    const { limit, page, category, status, sort } = req.query;
    const { user } = req.session;
    delete user.password;  
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

viewsRouter.get("/carts/:cid", isAuth, async (req, res) => {
    let id = req.params.cid;
    const { user } = req.session;
    delete user.password;
    try {
        let cart = await cartDAO.getCartById(id);        

        res.render('carts', {
            cart,
            user,            
        });
    } catch (err) {
        res.status(500).send({ status: "error", error: err })
    }
});

viewsRouter.get('/realtimeproducts', isAuth, (req, res) => {
    const { user } = req.session;
    delete user.password;
    res.render('realTimeProducts', {
        user,            
    });
});

viewsRouter.get('/chat', isAuth, (req, res) => {
    res.render('chat');
});

viewsRouter.get('/register', isGuest, (req, res) => {
	res.render('register', {
		title: 'Registrar Nuevo Usuario',
	});
});

viewsRouter.get('/login', isGuest, (req, res) => {
	res.render('login', {
		title: 'Inicio de Sesión',
	});
});

viewsRouter.get('/', isAuth, (req, res) => {
	const { user } = req.session;
	delete user.password;
	res.render('index', {
		title: 'Perfil de Usuario',
		user,
	});
});

export default viewsRouter;