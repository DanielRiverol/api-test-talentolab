import express from "express";
import { envs } from "./config/envs.js";
import { conectarMongoDB } from "./config/dbmongo.js";

// import usersRoutes from "./routes/user.routes.js";
import usersRoutes from "./routes/user.routes.mongo.js";
import { join, __dirname } from "./utils/index.js";

const app = express();
app.set("PORT", envs.port);

app.use(express.json());
app.use(express.static(join(__dirname, "/uploads")));

app.use("/api/users", usersRoutes);
conectarMongoDB();

app.listen(app.get("PORT"), () =>
  console.log(`Server running on port ${app.get("PORT")}`)
);
