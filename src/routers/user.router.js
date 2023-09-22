import { Router } from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import usersController from "../controllers/users.controller.js";
import environment from "../config/environment.js";
import { uploadFile } from "../middleware/upload.middleware.js";
import { middlewarePassportJWT } from '../middleware/jwt.middleware.js';

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
	async (req, res) => { }
);

userRouter.get(
	'/githubcallback',
	passport.authenticate('github', { failureRedirect: '/login' }),
	(req, res) => {
		req.session.user = req.user;
		let user = req.session.user
		const token = jwt.sign({ user }, 'privateKey', { expiresIn: '1h' });
		res.cookie('token', token, {
			httpOnly: true,
			maxAge: 6000000,
		}).redirect('/products');
	}
);

userRouter.post('/logout', middlewarePassportJWT, async (req, res) => {
	let user = req.user
	user = await usersController.getUserByEmail(user.email);	
	user.last_connection = new Date();
	await usersController.updateUser(user._id, user);
	res.clearCookie('token');
	res.redirect('/login');
});

userRouter.post('/login', async (req, res) => {
	const { email, password } = req.body;
	let user = {};
	try {
		if (email === environment.ADMIN_NAME && password === environment.ADMIN_PASSWORD) {
			user = {
				first_name: "Coder",
				last_name: "House",
				email: email,
				age: 26,
				password: password,
				img: "https://pbs.twimg.com/profile_images/1465705281279590405/1yiTdkKj_400x400.png",
				rol: "admin",
				cart: "",
				documents: [],
				last_connection: new Date(),
				_id: "coder",

			};
		} else {
			user = await usersController.getUserByEmail(email);
			user.last_connection = new Date();
			await usersController.updateUser(user._id, user);
			if (!user) {
				return res.redirect('/loginError');
			}
			if (!bcrypt.compareSync(password, user.password)) {
				return res.redirect('/loginError');
			}
		}
		const token = jwt.sign({ user }, 'privateKey', { expiresIn: '1h' });
		res.cookie('token', token, {
			httpOnly: true,
			maxAge: 6000000,
		}).redirect('/products');
	} catch (err) {
		res.redirect('/loginError');
	}
}
);

userRouter.post('/premium/:uid', async (req, res) => {
	let uid = req.params.uid;
	let userRol = req.body
	try {
		let user = await usersController.getUserById(uid);
		user.rol = `${userRol.rol}`;
		user = await usersController.updateUser(uid, user);
		res.status(201).send({ status: "success", payload: user })
	}
	catch (err) {
		req.logger.error(err)
		res.status(500).send({ status: "error", error: err })
	}
});

userRouter.post('/:uid/documents', middlewarePassportJWT, uploadFile("public/documents", ".jpg").array("documents", 2), async (req, res) => {
	let uid = req.params.uid;
	try {
		let user = await usersController.getUserById(uid);
		user.img = `/documents/${req.files[0].filename}`;
		user = await usersController.updateUser(uid, user);
		res.send("Files uploaded successfully");
	}
	catch (err) {
		console.log("Estoy en error")
		console.log(err)
		req.logger.error(err)
		res.status(500).send({ status: "error", error: err })
	}
});

export default userRouter;