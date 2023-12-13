import passport from "passport";
import local from "passport-local";
import usersModel from "../dao/dbManager/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";

//local es autenticacion con usuario y contraseña
const LocalStrategy = local.Strategy;

const initializePassport = () => {
  //Implementación de nuestro registro
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true, //permite acceder al objeto request como cualquier otro middleware
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;
          const user = await usersModel.findOne({ email: username });

          if (user) {
            return done(null, false, { message: "User already exists" });
          }

          const userToSave = {
            first_name,
            last_name,
            email: username,
            age,
            password: createHash(password),
          };

          const result = await usersModel.create(userToSave);
          return done(null, result); //req.user {first,last,age,email}
        } catch (error) {
          return done(error); // Devolver el error completo
        }
      }
    )
  );
  //Implementación de nuestro login
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await usersModel.findOne({ email: username });

          if (!user || !isValidPassword(password, user.password)) {
            return done(null, false, { message: "Invalid email or password" });
          }

          return done(null, user); //req.user
        } catch (error) {
          return done(error); // Devolver el error completo
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

  //Implementación de nuestro mecanismo de autenticación con github
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.22658f70d990ed1c",
        clientSecret: "9e0fd21cb4aba6532d255f6e9e6d795bb500eb50",
        callbackURL: "http://localhost:8080/api/sessions/github-callback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const user = await usersModel.findOne({ email });

          if (!user) {
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 18,
              email,
              password: "",
            };

            const createdUser = await usersModel.create(newUser);

            if (!createdUser) {
              return done(null, false, { message: "Failed to create user" });
            }

            return done(null, createdUser);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error); // Manejar cualquier error no anticipado aquí
        }
      }
    )
  );
};

export { initializePassport };
