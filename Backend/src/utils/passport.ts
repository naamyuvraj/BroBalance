import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../modules/user/user.model.js';
import type { IUser } from '../modules/user/user.model.js';

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: 'https://w2mxl9h3-8000.inc1.devtunnels.ms/api/auth/google/callback',
                proxy: true,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log('Google profile received:', profile.id, profile.displayName, profile.emails?.[0]?.value);
                    let user = await User.findOne({ googleId: profile.id });

                    if (!user) {
                        const email = profile.emails?.[0]?.value ?? '';
                        if (email) {
                            user = await User.findOne({ email });
                        }

                        if (user) {
                            user.googleId = profile.id;
                            const photo = profile.photos?.[0]?.value;
                            if (photo) user.avatarUrl = photo;
                            await user.save();
                        } else {
                            const photo = profile.photos?.[0]?.value;
                            user = await User.create({
                                username: profile.displayName,
                                email: email,
                                googleId: profile.id,
                                ...(photo ? { avatarUrl: photo } : {}),
                            });
                        }
                    }

                    return done(null, user);
                } catch (error) {
                    console.error('Google OAuth strategy error:', error);
                    return done(error as Error, undefined);
                }
            }
        )
    );
    console.log('Google OAuth configured');
} else {
    console.log('Google OAuth not configured (missing credentials)');
}

passport.serializeUser((user: any, done) => done(null, user._id));

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;