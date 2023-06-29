import { Router } from "express";
import UserDAO from "../dao/UserDAO.js";
import { hashPassword, comparePassword } from "../dao/utils/encrypt.utils.js";
import passport from "passport";

const userRouter = Router();

userRouter.post(
    '/',
    passport.authenticate('register', { failureRedirect: '/registerError' }),
    async (req, res) => {
        res.redirect('/products');
    }
);

userRouter.get(
	'/github',
	passport.authenticate('github', { scope: ['user:email'] }),
	async (req, res) => {}
);

userRouter.get(
	'/githubcallback',
	passport.authenticate('github', { failureRedirect: '/login' }),
	(req, res) => {
		req.session.user = req.user;
		res.redirect('/products');
	}
);

userRouter.post(
    "/auth",
    passport.authenticate("login", { failRedirect: '/loginError' }),
    async (req, res) => {
        if (!req.user) return res.status(400).send("Usuario no encontrado")
        const user = req.user;
        delete user.password;
        req.session.user = user;
        res.redirect('/products');
    })

userRouter.post("/logout", (req, res) => {
    req.session.destroy();
    res.redirect('/login');
})

export default userRouter;