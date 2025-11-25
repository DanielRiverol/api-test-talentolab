import express from "express";
import { envs } from "./config/envs.js";
import { conectarMongoDB } from "./config/dbmongo.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import usersRoutes from "./routes/user.routes.mongo.js";
import {
  join,
  __dirname,
  swaggerOptions,
  optionsUI,
  limiter,
} from "./utils/index.js";

// settings
const app = express();
app.set("PORT", envs.port);

app.use(cors());
// middlewares
app.use(express.json());
app.use(express.static(join(__dirname, "/uploads")));
app.use(limiter);
// routes
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});
app.use("/api/users", usersRoutes);
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Ruta para servir la documentación gráfica
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, optionsUI));
// liteners
conectarMongoDB();

app.listen(app.get("PORT"), () =>
  console.log(`Server running on port ${app.get("PORT")}`)
);
