import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from "./prismaClient.js";
import passport from "passport"
import bcrypt from "bcryptjs";

// LocalStrategy callback
async function localVerifyCallback(username, password, done) {
	try {
		const user = await prisma.user.findUnique({
			where: {
				username,
			},
		});
		if (!user) {
			return done(null, false, { message: "Incorrect username or password." });
		}

		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return done(null, false, { message: "Incorrect username or password" });
		}

		return done(null, user);
	} catch (err) {
        console.error(err);
		return done(err);
	}
}

async function googleVerifyCallback(accessToken, refreshToken, profile, cb) {
	try {
		const user = await prisma.user.upsert({
			where: {
				googleId: profile.id,
			}, 
			update: {
                googleName: profile.displayName,
            },
			create: {
				googleId: profile.id,
				googleName: profile.displayName,
				provider: "GOOGLE"
			}
		});

		cb(null, user);
	} catch(err) {
		cb(err);
	}
}

// Config
passport.use("login", new LocalStrategy(localVerifyCallback));
passport.use("google", new GoogleStrategy({
	clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
	clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
	callbackURL: process.env.GOOGLE_OAUTH_REDIRECT_URI,
}, 
googleVerifyCallback
));