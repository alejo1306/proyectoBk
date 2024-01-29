import passport from 'passport';
import { UserModel } from '../daos/models/UserModel.js';

export const renderLogin = (req, res) => {
    const errorMessage = req.query.error;
    res.render('login', { error: errorMessage });
};

export const processLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Autenticación fallida
            return res.redirect('/auth/login?error=Credenciales incorrectas');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            // Autenticación exitosa
            return res.redirect('/api/products');
        });
    })(req, res, next);
};
export const renderSignup = (req, res) => {
    res.render('signup');
};

export const processSignup = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = new UserModel({ email, password });
        await user.save();
        res.redirect('/auth/login');
    } catch (error) {
        res.status(500).send('Error en el registro');
    }
};

export const logout = (req, res) => {
    req.logout();
    res.redirect('/auth/login');
};