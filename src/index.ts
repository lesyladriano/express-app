import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import { AppDataSource } from "./data-source";
import userRouter from "./routes/userRouter";
import { logger } from "./middleware/logger";

AppDataSource.initialize()
    .then(async () => {
    
        const app = express();

        // THIRD PARTY MIDDLEWARE
        app.use(cors()); // Use the 'cors' middleware here

        // BUILT-IN MIDDLEWARE
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // CUSTOMIZED MIDDLEWARE
        app.use(logger);

        app.use("/public", userRouter);
        app.listen(3000);
        console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");
    })
    .catch(error => console.log(error));
