import passport from 'passport';
import passportLocal from 'passport-local';
import GitHubStrategy from "passport-github2"
import userModel from '../models/user.model.js';
import { createHash, isValidPas } from '../utils.js';
import jwtStrategy from "passport-jwt";
import { PRIVATE_KEY } from "../utils.js";

const localStrategy = passportLocal.Strategy;

const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {
    
    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        }, async (jwt_payload, done) => {
            try {
                console.log("JWT obtained from Payload:");
                console.log(jwt_payload);
                return done(null, jwt_payload.user)
            } catch (error) {
                return done(error)
            }
        }
    ));
    
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                const exist = await userModel.findOne({ email });
                if (exist) {
                    console.log("User already exists");
                    done(null, false)
                }

                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    loggedBy: 'form'
                }
                const result = await userModel.create(user);
                console.log(result);
                return done(null, result)
            } catch (error) {
                return done("Error registering the user " + error);
            }
        }
    ));
    
    // GITHUB
    // passport.use('github', new GitHubStrategy(
    //     { 
    //         clientID: "Iv1.e4da1811720c0779",
    //         clientSecret: "b23f11925db43edb0b5d58db11562d8066825752",
    //         callbackUrl: "http://localhost:8080/api/sessions/githubcallback"
    //     },
    //     async (accessToken, refreshToken, profile, done) => {
    //         console.log("Profile obtenido del usuario de GitHub: ");
    //         console.log(profile);
    //         try {
    //             const user = await userModel.findOne({ email: profile._json.email });
    //             console.log("Usuario encontrado para login:");
    //             console.log(user);
    //             if (!user) {
    //                 console.warn("User doesn't exists with username: " + profile._json.email);
    //                 let newUser = {
    //                     first_name: profile._json.name,
    //                     last_name: '',
    //                     age: 28,
    //                     email: profile._json.email,
    //                     password: '',
    //                     loggedBy: "GitHub"
    //                 }
    //                 const result = await userModel.create(newUser);
    //                 return done(null, result)
    //             } else {
    //                 return done(null, user)
    //             }

    //         } catch (error) {
    //             return done(error)
    //         }
    //     })
    // );

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user)
        } catch (error) {
            console.error("Error deserializing the user: " + error);
        }
    });
}

const cookieExtractor = (req) => {
    let token = null;
    console.log("Cookie Extractor");
    if (req && req.cookies) {
        console.log("Cookies: ");
        console.log(req.cookies);
        token = req.cookies['jwtCookieToken']
        console.log("Token obtained from Cookie:");
        console.log(token);
    }
    return token;
};

export default initializePassport;