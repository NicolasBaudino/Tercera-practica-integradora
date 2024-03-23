import path from "path";
import { fileURLToPath } from "url";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from "passport";
import { faker } from "@faker-js/faker";
import nodemailer from "nodemailer";
import config from "./config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPas = (accountPassword, passwordLogin) => {
  const isValid = bcrypt.compare(passwordLogin, accountPassword);
  return isValid;
};


// jwt
export const PRIVATE_KEY = "SecretKeyJWT"

export const generateJWToken = (user) => {
    return jwt.sign({user}, PRIVATE_KEY, {expiresIn: '1h'})
};

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Token present in header auth:");
    console.log(authHeader);
    if (!authHeader) {
        return res.status(401).send({ error: "User not authenticated or missing token." });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({ error: "Token invalid, Unauthorized!" });
        req.user = credentials.user;
        console.log("Information from token:");
        console.log(req.user);
        next();
    });
};

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        console.log(strategy);
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
            }
            console.log("Usuario obtained from strategy: ");
            console.log(user);
            req.user = user;
            next();
        })(req, res, next);
    }
};

export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send("Unauthorized: User not found in JWT")

        if (req.user.role !== role) {
            return res.status(403).send("Forbidden: user doesn't have permission with this role.");
        }
        next()
    }
};

// faker

export const generateFakeProduct = (
  title,
  description,
  price,
  thumbnail,
  code,
  stock,
  category,
  status
) => {
  const EnumCategory = [
    "Categoria 1",
    "Categoria 2",
    "Categoria 3",
  ];

  return {
    title: title === null || title ? title : faker.commerce.productName(),
    description:
      description === null || description
        ? description
        : faker.commerce.productDescription(),
    price:
      price === null || price
        ? price
        : faker.commerce.price({ min: 0, max: 10000 }),
    thumbnail:
      thumbnail === null || thumbnail ? thumbnail : faker.image.url(300, 300),
    code: code === null || code ? code : faker.string.nanoid(21).toUpperCase(),
    stock: stock === null || stock ? stock : faker.number.int(200),
    category:
      category === null || category
        ? category
        : EnumCategory[Math.floor(Math.random() * EnumCategory.length)],
    status: status === null || status ? status : faker.datatype.boolean(),
  };
};

// nodemailer

export const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.userMail,
    pass: config.userPassword,
  },
});

export default __dirname;