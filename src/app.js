import express from "express";
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js"
import mongoose from "mongoose";
import messageDao from "./daos/dbManager/message.dao.js";
import userRouter from "./routes/user.views.router.js"
import sessionRouter from "./routes/sessions.router.js"
import session from "express-session";
import MongoStore from "connect-mongo";
import githubLoginRouter from "./routes/github-login.views.router.js"
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import jwtRouter from "./routes/jwt.router.js"
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import mockRouter from "./routes/mock.router.js";


const app = express();
const PORT = config.port;
const mongoURL = config.urlMongo; 

app.use(cookieParser());
app.use(session({
  store: MongoStore.create({
    mongoUrl: mongoURL,
    ttl: 10 * 60
  }),
  secret: "n1C0l4sS3CR3T",
  resave: false,
  saveUninitialized: true
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(mongoURL)
.then(() => {
    console.log('Connection success');
})
.catch(error => {
    console.error('Connection fail', error);
});

const httpServer = app.listen(PORT, () => {console.log(`Server listening on port ${PORT}`)});

const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine("hbs", handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
    // handlebars: allowInsecurePrototypeAccess(handlebars)
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    }
})
);

app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

app.use(express.static(`${__dirname}/public`))

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
});

io.on('connection', (socket) => {
    socket.on('chat message', async (data) => {
      try {
        await messageDao.createMessage(data.user, data.content);
        io.emit('chat message', data);
      } 
      catch(error) {
        console.log(error);
        res.json({
            error,
            message: "Error"
        });
    }
    });
  });

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/users", userRouter);
app.use("/api/jwt", jwtRouter);
app.use("/github", githubLoginRouter);
app.use("/", mockRouter);
app.use("/", viewsRouter);