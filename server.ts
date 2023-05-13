import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./Routers/User.routes";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "./swaggerOptions";
import swaggerUi from "swagger-ui-express";
import { errors } from "celebrate";
import bodyParser from "body-parser";
import { connectDatabase } from "./Database/DatabaseConfig";
import router from "./Routers/index.routes";

dotenv.config();

const port = process.env.PORT || 5000;

const app: express.Application = express();

//connect Database
connectDatabase();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

// Serve the Swagger UI
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// api router
app.use("/api", router);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

app.use(errors());
app.listen(port, () => {
  console.log("Server is running at", Number(port));
});
