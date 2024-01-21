import { renderLogin, processLogin, renderSignup, processSignup, logout } from '../controlador/authController.js';
import express from 'express';

const router = express.Router();

router.get('/login', renderLogin);
router.post('/login', processLogin);

router.get('/signup', renderSignup);
router.post('/signup', processSignup);

router.get('/logout', logout);

export default router;