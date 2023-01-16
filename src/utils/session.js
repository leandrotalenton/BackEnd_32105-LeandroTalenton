import MongoStore from 'connect-mongo';
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

export const sessionObj = {
    secret: "secret123123",
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${process.env.DB_SESSION_USER}:${process.env.DB_SESSION_PASS}@cluster${process.env.DB_SESSION_CLUSTERNAME}.fyskstk.mongodb.net/${process.env.DB_SESSION_NAME}`,
        // mongoUrl: "mongodb+srv://LeandroCoder:Coder123123@clusterleandrocoder.fyskstk.mongodb.net/leandroCoderDb",
        mongoOptions,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 } // 10min
}