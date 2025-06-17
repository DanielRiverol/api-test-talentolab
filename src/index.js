import express from "express";
import { envs } from "./config/envs.js";
import { conectarMongoDB } from "./config/dbmongo.js";
import { rateLimit } from "express-rate-limit";

// import usersRoutes from "./routes/user.routes.js";
import usersRoutes from "./routes/user.routes.mongo.js";
import { join, __dirname } from "./utils/index.js";

// settings
const app = express();
app.set("PORT", envs.port);
// limitador de velocidad
 const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 10, // Máximo de 10 requests por IP
  standardHeaders: true,
  legacyHeaders: false,
});

// middlewares
app.use(express.json());
app.use(express.static(join(__dirname, "/uploads")));
app.use(limiter);
// routes
app.use("/api/users", usersRoutes);

// liteners
conectarMongoDB();

app.listen(app.get("PORT"), () =>
  console.log(`Server running on port ${app.get("PORT")}`)
);
