import MongoStore from 'connect-mongo';
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

export const sessionObj = {
    secret: "secret123123",
    store: MongoStore.create({
        // mongoUrl: `mongodb+srv://${process.env.DB_SESSION_USER}:${process.env.DB_SESSION_PASS}@cluster${process.env.DB_SESSION_CLUSTERNAME}.fyskstk.mongodb.net/${process.env.DB_SESSION_NAME}`,
        mongoUrl: `mongodb://localhost:27017/proyectoFinal`,
        mongoOptions,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 } // 10min
}