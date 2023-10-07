import productsService from "../services/products.service.js";
import cartsService from "../services/carts.service.js";
import usersService from "../services/users.service.js";
import environment from '../config/environment.js';
import Swal from 'sweetalert2';

export default class ViewsController {
    async getProducts(req, res) {
        const { limit, page, category, status, sort } = req.query;
        const user = req.user;
        try {
            let products = await productsService.getProducts(limit, page, category, status, sort);
            res.render('products', {
                products,
                user,
            });
        }
        catch (err) {
            req.logger.error(`Error information: ${err}`);
            res.status(500).send({ status: "error", error: err })
        }
    }

    async getCartById(req, res) {
        let id = req.params.cid.replace(/^'|'$/g, '');
        const user = req.user;
        try {
            let cart = await cartsService.getCartById(id);
            res.render('carts',
                {
                    title: 'Cart',
                    cart,
                    user,
                });
        } catch (err) {
            req.logger.error(`Error information: ${err}`);
            res.status(500).send({ status: "error", error: err })
        }
    }

    realTimeProducts(req, res) {
        const user = req.user;
        res.render('realTimeProducts', {
            user,
        });
    }

    async chats(req, res) {
        const user = req.user;
        res.render('chat', {
            user,
        });
    }

    register(req, res) {
        res.render('register', {
            title: 'Registrar nuevo usuario',
        });
    }
    registerError(req, res) {
        res.render('registerError', {
            title: 'Error al registrar nuevo usuario',
        });
    }

    loginError(req, res) {
        res.render('loginError', {
            title: 'Error al iniciar sesión',
        });
    }

    async login(req, res) {
        res.render('login', {
            title: 'Inicio de sesión',
        });
    }

    home(req, res) {
        if (!req.user) {
            res.render('login', {
                title: 'Inicio de sesión',
            });
        } else {
            res.redirect('/products');
        }
    }

    async current(req, res) {
        try {
            let user = await usersService.getUserById(req.user._id);
            if (!user) {
                user = req.user;
                res.render('profile', {
                    title: 'Perfil de Usuario',
                    user,
                });
            } else {
                res.render('profile', {
                    title: 'Perfil de Usuario',
                    user,
                });
            }
        }
        catch (err) {
            req.logger.error(`Error information: ${err}`);
            res.status(500).send({ status: "error", error: err })
        }
    }

    async restorePassword(req, res) {
        let userId = req.params.uid;
        let tokenHash = req.params.token;
        try {
            const jwt = await import('jsonwebtoken');
            const secretKey = environment.SECRET_KEY;

            jwt.default.verify(tokenHash, secretKey, async (err, decoded) => {
                if (err) {
                    req.logger.error(err)
                    res.render('loginError', {
                        title: 'Token caducado',
                    });
                }
                if (decoded) {
                    let newUser = await usersService.getUserById(userId);
                    res.render('restorePassword', {
                        title: 'Restablecer contraseña',
                        newUser
                    });
                }
            });

        } catch (err) {
            req.logger.error(`Error information: ${err}`);
            res.status(500).send({ status: "error", error: err })
        }
    }

    async userToPremium(req, res) {
        try {
            let user = await usersService.getUserById(req.user._id);
            if (!user) {
                user = req.user;
                res.render('premium', {
                    title: 'Usuario premium',
                    user,
                });
            } else {
                res.render('premium', {
                    title: 'Usuario premium',
                    user,
                });
            }
        } catch (err) {
            req.logger.error(`Error information: ${err}`);
            res.status(500).send({ status: "error", error: err })
        }
    }
}