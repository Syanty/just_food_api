const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const jwt = require("jsonwebtoken");
const localStrategy = require("passport-local").Strategy;
const User = require("../models/user");

passport.use(
    "signup",
    new localStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            session: false,
            passReqToCallback:true
        },
        async (req,email, password, done) => {
            try {
                const userExist = await User.findOne({ email: email })
                if (userExist) {
                    return done(null, false, { message: "Email is already taken.", statusCode: 400 });
                }
                const token = jwt.sign({ email: email }, process.env.SECRET, {
                    expiresIn: "1h",
                });
                const user = await User.create({
                    first_name:req.body.first_name,
                    last_name:req.body.last_name,
                    email,
                    password,
                    confirmationCode: token,
                    phone:req.body.phone,
                    isAdmin:req.body.isAdmin
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
                if (user.status != "Active") {
                    return done(null,false,{
                        message: "Pending Account. Please Verify Your Email!",
                        statusCode:400
                    });
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