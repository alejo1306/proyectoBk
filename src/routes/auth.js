import { renderLogin, processLogin, renderSignup, processSignup, logout } from '../controlador/authController.js';
import express from 'express';
import passport from 'passport';


const router = express.Router();

router.get('/signup', renderSignup);
router.post('/signup', processSignup);

router.get('/logout', logout);

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
}));


export default router;