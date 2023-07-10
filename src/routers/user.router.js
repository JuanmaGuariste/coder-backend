import { Router } from "express";
import userDAO from "../dao/mongo/UserDAO.js";
import passport from "passport";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

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
		const token = jwt.sign({ user: req.session.user }, 'privateKey', { expiresIn: '1h' });		
				res.cookie('token', token, {
					httpOnly: true,
					maxAge: 6000000,
				}).redirect('/products');
	}
);

userRouter.post('/logout', (req, res) => {
	res.clearCookie('token');
	res.redirect('/login');
  });

userRouter.post('/login', async (req, res) => {
	const { email, password } = req.body;
	
	let user = {};
		try {
			if (email === "adminCoder@coder.com" && password === "1234") {
                user = {
                    first_name: "Coder",
                    last_name: "House",
                    email: email,
					age: 26,
                    password: password,
                    img: "https://pbs.twimg.com/profile_images/1465705281279590405/1yiTdkKj_400x400.png",
                    rol: "admin",
					cart: [],
                    _id: "coder",
                };  
            } else {			
				user = await userDAO.getUserByEmail(email);
				if (!user) {
					return res.redirect('/registerError');
				}		
				if (!bcrypt.compareSync(password, user.password)) {
					return res.redirect('/registerError');
				}	
			}	
				const token = jwt.sign({ user }, 'privateKey', { expiresIn: '1h' });		
				res.cookie('token', token, {
					httpOnly: true,
					maxAge: 6000000,
				}).redirect('/products');
						
		} catch (err) {
			res.redirect('/registerError');
		}
    }
);

export default userRouter;