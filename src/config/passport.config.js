import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import local from 'passport-local';
import userDAO from '../dao/mongo/UserDAO.js';
import cartDAO from '../dao/mongo/CartDAO.js';
import { hashPassword, comparePassword } from '../utils/encrypt.utils.js';
import jwt from "passport-jwt";
import { Strategy, ExtractJwt } from 'passport-jwt';

const jwtStrategy = jwt.Strategy
const jwtExtract = ExtractJwt;
const LocalStrategy = local.Strategy;

const inicializePassport = () => {
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.27225588721570ec",
        clientSecret: "f7382fc12bf753556a5014fbf4d20a1b37f789db",
        callbackURL: "http://localhost:8080/api/user/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userDAO.getUserByEmail(profile._json.email);
            let newCart = await cartDAO.addCart({});  
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    email: profile._json.email,                 
                    password: "", 
                    img: profile._json.avatar_url,
                    cart: newCart._id,
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
            const { first_name, last_name, img, age } = req.body;
            try {
                const user = await userDAO.getUserByEmail(username);
                if (user) {
                    return done(null, false, { message: 'El usuario ya existe' });
                }
                const hashedPassword = hashPassword(password);
                let newCart = await cartDAO.addCart({});             
                const newUser = await userDAO.createUser({
                    first_name,
                    last_name,
                    email: username,
                    age,
                    password: hashedPassword,
                    cart: newCart._id,
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

export default inicializePassport;