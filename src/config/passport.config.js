import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import local from 'passport-local';
import usersController from '../controllers/users.controller.js';
import cartsController from '../controllers/carts.controller.js';
import { hashPassword } from '../utils/encrypt.utils.js';
import jwt from "passport-jwt";
import { ExtractJwt } from 'passport-jwt';
import environment from '../config/environment.js';

const jwtStrategy = jwt.Strategy
const jwtExtract = ExtractJwt;
const LocalStrategy = local.Strategy;

const generateJWTToken = async (payload) => {
    const secretKey = environment.SECRET_KEY;
    const expiresIn = '1h';
    const jwt = await import('jsonwebtoken')
    const token = jwt.default.sign(payload, secretKey, { expiresIn });
    return token;
}

const inicializePassport = () => {
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.27225588721570ec",
        clientSecret: "f7382fc12bf753556a5014fbf4d20a1b37f789db",
        callbackURL: "http://localhost:8080/api/user/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await usersController.getUserByEmail(profile._json.email);
            if (!user) {
                let newCart = await cartsController.addCart();
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    email: profile._json.email,
                    password: "",
                    img: profile._json.avatar_url,
                    cart: newCart._id,
                }
                user = await usersController.createUser(newUser);
                done(null, user)
            } else {
                done(null, user)
            }
        } catch (err) {
            done(err, false);
        }
    }));

    passport.use(
        'register',
        new LocalStrategy({
            usernameField: 'email',
            passReqToCallback: true
        }, async (req, username, password, done) => {
            const { first_name, last_name, img, age } = req.body;
            try {
                const user = await usersController.getUserByEmail(username);
                if (user) {
                    return done(null, false, { message: 'El usuario ya existe' });
                }
                const hashedPassword = hashPassword(password);
                let newCart = await cartsController.addCart();
                let userData = {
                    first_name,
                    last_name,
                    email: username,
                    age,
                    password: hashedPassword,
                    cart: newCart._id,
                    img,
                }
                const newUser = await usersController.createUser(userData);
                return done(null, newUser);
            } catch (err) {
                return done(err);
            }
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        if (id === "coder") {
            return done(null, true);
        } else {
            const user = await usersController.getUserById(id);
            if (!user) return done(null, false, { message: 'Usuario no encontrado' });
            return done(null, user);
        }
    });

    passport.use(
        'jwt',
        new jwtStrategy(
            {
                jwtFromRequest: jwtExtract.fromExtractors([cookieExtractor]),
                secretOrKey: 'privateKey',
            },
            (payload, done) => {
                done(null, payload.user);
            }
        ),
        async (payload, done) => {
            try {
                return done(null, payload);
            } catch (error) {
                done(error);
            }
        }
    );
}

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};

export { inicializePassport, generateJWTToken };