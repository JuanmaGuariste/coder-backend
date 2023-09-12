import passport from "passport";
import jwt from "jsonwebtoken";

const privateKey = 'privateKey';

const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader){
        res.status(401).send({message: "Token not found"});
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, privateKey, (err, credentials) => {
        if (err){
            res.status(401).send({message: "Token invalid"});
        }
        req.user = credentials.user;
        next();
    })
} 

const middlewarePassportJWT = async (req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, usr, info) => {        
		if (err) {
			next(err);
		}
		if (!usr) {
			res.redirect('/login');
		}
		req.user = usr;        
		next();
	})(req, res, next);
};

export {middlewarePassportJWT, authToken};