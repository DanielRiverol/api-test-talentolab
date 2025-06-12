// models/usuario.model.js
// import mongoose from "mongoose";

// const usuarioSchema = new mongoose.Schema({
//   nombre: { type: String, required: true },
//   email: { type: String, required: true },
//   contrasena: { type: String, required: true },
//   cv: { type: String },
// });

// const Usuario = mongoose.model("Usuario", usuarioSchema);

// export default Usuario;
import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  contrasena: String,
  cv: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 12, // 12 horas
  },
});

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;
