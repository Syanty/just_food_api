const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../models/user");

passport.use(
    "signup",
    new localStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            session: false,
        },
        async (email, password, done) => {
            try {
                const userExist = await User.findOne({ email: email })
                if (userExist) {
                    return done(null, false, { message: "Email is already taken.", statusCode: 400 });
                }


                const user = await User.create({
                    email,
                    password,
                });

                return done(null, user, { message: "Verification link has been sent to the email. Please Verify it before logging in." });
            } catch (error) {
                done(error);
            }


        }
    )
);
passport.use(
    "login",
    new localStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false, { message: "Email is not registered", statusCode: 404 });
                }

                if (!user.email_verified) {
                    return done(null, false, { message: "Please verify your email", statusCode: 400 });
                }

                const isValid = await user.isValidPassword(password);
                if (!isValid) {
                    return done(null, false, { message: "Password Incorrect", statusCode: 400 });
                }

                return done(null, user, { message: "User Logged in Successfully", statusCode: 200 });
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.SECRET,
            jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
        },
        async (token, done) => {
            try {
                const user = await User.findOne({ email: token.user.email });
                if (!user) {
                    return done({ message: "User not found", status: 404 });
                }
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);