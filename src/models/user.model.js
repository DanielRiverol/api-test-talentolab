// models/usuarioModel.js
import pool from "../config/database.js";

const UsuarioModel = {
  async crear({ nombre, email, contrasena, cv }) {
    const sql = `
      INSERT INTO usuarios (nombre, email, contrasena, cv)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [nombre, email, contrasena, cv]);
    return result.insertId;
  },

  async obtenerTodos() {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, cv, creado_en FROM usuarios"
    );
    return rows;
  },

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, cv, creado_en FROM usuarios WHERE id = ?",
      [id]
    );
    return rows[0];
  },
};

export default UsuarioModel;
