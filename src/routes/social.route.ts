import express, { Router } from 'express';
import passport from 'passport';
import { authController } from '../modules/auth';

const router: Router = express.Router();


/* google */
router.get('/google/signup', passport.authenticate('google', {
    scope: ['profile', 'email']
}));


router.get('/auth/google/redirect', passport.authenticate('google'), authController.oauthSignin);

export default router;