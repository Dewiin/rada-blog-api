import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from "./prismaClient.js";
import passport from "passport"
import bcrypt from "bcryptjs";
import "dotenv/config";

// LocalStrategy callback
async function localSignupVerifyCallback(username, password, done) {
	try {
        const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				username,
                password,
                provider: "LOCAL",
			},
		});		

		return done(null, user);
	} catch (err) {
        console.error(err);
		return done(err);
	}
}

async function localLoginVerifyCallback(username, password, done) {
	try {
		const user = await prisma.user.findUnique({
			where: {
				username,
			},
		});
		if (!user) {
			return done(null, false, { message: "Username not found." });
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

// Config
passport.use("signup", new LocalStrategy(localSignupVerifyCallback));
passport.use("login", new LocalStrategy(localLoginVerifyCallback));