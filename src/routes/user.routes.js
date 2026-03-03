import express from "express";
import multer from "multer";
import { Builder } from "xml2js";
import UsuarioModel from "../models/user.model.js";

const router = express.Router();
const builder = new Builder();

// Multer en memoria
const upload = multer({ storage: multer.memoryStorage() });

// GET JSON
router.get("/json", async (req, res) => {
  try {
    const usuarios = await UsuarioModel.obtenerTodos();
    res.json(usuarios);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al obtener usuarios", err: err.message });
  }
});

// GET XML
router.get("/xml", async (req, res) => {
  try {
    const usuarios = await UsuarioModel.obtenerTodos();
    const xml = builder.buildObject({ usuarios });
    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    res.status(500).send(`<error>Error al obtener usuarios</error>`);
  }
});

// POST JSON
router.post("/json", upload.single("cv"), async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;

    if (!nombre || !email || !contrasena) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const cvUrl = req.file ? `uploads/${req.file.originalname}` : null;

    const id = await UsuarioModel.crear({
      nombre,
      email,
      contrasena,
      cv: cvUrl,
    });

    res.status(201).json({ mensaje: "Usuario creado", id, cv: cvUrl });
  } catch (err) {
    res.status(500).json({ error: "Error al crear usuario", err: err.message });
  }
});

// POST XML
router.post("/xml", upload.single("cv"), async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;

    if (!nombre || !email || !contrasena) {
      return res
        .status(400)
        .set("Content-Type", "application/xml")
        .send(`<error>Faltan campos obligatorios</error>`);
    }

    const cvUrl = req.file ? `uploads/${req.file.originalname}` : null;

    const id = await UsuarioModel.crear({
      nombre,
      email,
      contrasena,
      cv: cvUrl,
    });

    const xml = builder.buildObject({
      mensaje: "Usuario creado",
      id,
      cv: cvUrl,
    });

    res.set("Content-Type", "application/xml");
    res.status(201).send(xml);
  } catch (err) {
    res
      .status(500)
      .set("Content-Type", "application/xml")
      .send(`<error>Error al crear usuario: ${err.message}</error>`);
  }
});

export default router;
