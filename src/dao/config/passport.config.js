import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import local from 'passport-local';
import userDAO from '../UserDAO.js';
import { hashPassword, comparePassword } from '../utils/encrypt.utils.js';

const LocalStrategy = local.Strategy;

const inicializePassport = () => {
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.27225588721570ec",
        clientSecret: "f7382fc12bf753556a5014fbf4d20a1b37f789db",
        callbackURL: "http://localhost:8080/api/user/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userDAO.getUserByEmail(profile._json.email);
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    email: profile._json.email,
                    password: "",
                    img: profile._json.avatar_url,
                }
                user = await userDAO.createUser(newUser);
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
            const { first_name, last_name, img } = req.body;
            try {
                const user = await userDAO.getUserByEmail(username);
                if (user) {
                    return done(null, false, { message: 'El usuario ya existe' });
                }
                const hashedPassword = await hashPassword(password);
                const newUser = await userDAO.createUser({
                    first_name,
                    last_name,
                    email: username,
                    password: hashedPassword,
                    img,
                });
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
            const user = await userDAO.getUserById(id);
            if (!user) return done(null, false, { message: 'Usuario no encontrado' });
            return done(null, user);
        }
    });

    passport.use("login", new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
        try {
            if (username === "adminCoder@coder.com" && password === "1234") {
                const user = {
                    first_name: "Coder",
                    last_name: "House",
                    email: username,
                    password: password,
                    img: "https://pbs.twimg.com/profile_images/1465705281279590405/1yiTdkKj_400x400.png",
                    rol: "admin",
                    _id: "coder",
                };
                return done(null, user);
            } else {
                const user = await userDAO.getUserByEmail(username);
                if (!user) {
                    return done(null, false, { message: 'Usuario no encontrado' });
                }
                if (!comparePassword(user, password)) {
                    return done(null, false, { message: 'Dato incorrecto' });
                }
                return done(null, user);
            }
        } catch (err) {
            return done(err);
        }
    }));
}

export default inicializePassport;