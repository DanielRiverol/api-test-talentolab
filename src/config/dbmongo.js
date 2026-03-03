// db.js
import mongoose from "mongoose";
import { envs } from "../config/envs.js";
const { database } = envs;
export const conectarMongoDB = async () => {
  try {
    await mongoose.connect(database.db_url);
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
  }
};
