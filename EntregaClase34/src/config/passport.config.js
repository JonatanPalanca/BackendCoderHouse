import passport from "passport";
import jwt from "passport-jwt";
import local from "passport-local";
import usersModel from "../dao/dbManager/models/users.model.js";
import { createHash, isValidPassword, cartPath } from "../utils.js";
import GitHubStrategy from "passport-github2";
import CartManager from "../dao/dbManager/carts.db.js";
import configs from "../config/config.js";
import { passportStrategiesEnum } from "./enums.js";
import { UserManager } from "../dao/factory.js";
import logger from "../utils/logger.js";

const userManager = new UserManager();
const cartManager = new CartManager(cartPath);
const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  passport.use(
    passportStrategiesEnum.GITHUB,
    new GitHubStrategy(
      {
        clientID: "Iv1.22658f70d990ed1c",
        clientSecret: configs.gitHubClientSecret,
        callbackURL: configs.gitHubcallbackURL,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const carrito = await cartManager.save();

          const email = profile.emails[0].value;
          const user = await userManager.getUserByEmail(email);

          if (!user) {
            const newUser = {
              first_name: profile._json.login,
              last_name: " ",
              age: 5000,
              email,
              cart: carrito._id,
              password: " ",
            };

            const result = await userManager.save(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          logger.error(error);
          return done(`Incorrect credentials`);
        }
      }
    )
  );

  passport.use(
    passportStrategiesEnum.REGISTER,
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, age, cart } = req.body;
          if (!first_name || !last_name || !username || !age || !password) {
            return done(null, false);
          }

          const user = await userManager.getUserByEmail(username);
          if (user) {
            return done(null, false);
          }

          const userToSave = {
            first_name,
            last_name,
            email: username,
            age,
            password: createHash(password),
            cart,
            role: username === "adminCoder@coder.com" ? "admin" : "user",
          };

          const result = await userManager.save(userToSave);
          return done(null, result);
        } catch (error) {
          return done(`Incorrect credentials`);
        }
      }
    )
  );

  passport.use(
    passportStrategiesEnum.LOGIN,
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await userManager.getUserByEmail(username);
          if (!user || !isValidPassword(password, user.password)) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(`Incorrect credentials`);
        }
      }
    )
  );

  passport.use(
    passportStrategiesEnum.CURRENT,
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: configs.privateKeyJWT,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Serializaccion y DeSerializaccion
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await usersModel.findById(id);
    done(null, user);
  });
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"];
  }
  return token;
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(
      strategy,
      { session: false },
      function (err, user, info) {
        if (err) return next(err);
        if (!user) {
          logger.error(info.messages ? info.messages : info.toString());
          return res.status(401).send({
            status: "error",
            error: info.messages ? info.messages : info.toString(),
          });
        }
        req.user = user;
        next();
      }
    )(req, res, next);
  };
};

export { initializePassport };
