// authController.js
import passport from 'passport';
import { UserModel } from '../daos/models/UserModel.js';

export const renderLogin = (req, res) => {
    res.render('login');
};

export const processLogin = passport.authenticate('local', {
    successRedirect: '/api/products',
    failureRedirect: '/auth/login',
    failureFlash: true
});

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