import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PassportStatic } from 'passport';
import config from '../../config/config';


const configurePassport = (passport: PassportStatic): void => {
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser<any, any>((user, done) => done(null, user));

    passport.use(
        new GoogleStrategy(
            {
                clientID: config.social.clientID || '',
                clientSecret: config.social.clientSecret || '',
                callbackURL: config.social.callbackURL,
            },
            (_accessToken, _refreshToken, profile, done) => done(null, profile)
        )
    );

};

export default configurePassport;