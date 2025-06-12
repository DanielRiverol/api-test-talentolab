import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  contrasena: String,
  cv: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1800, // 30 minutos
  },
});

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;
