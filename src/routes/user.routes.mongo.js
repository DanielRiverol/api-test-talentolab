// routes/usuarioRoutes.js
import express from "express";
import multer from "multer";
import { Builder } from "xml2js";
import Usuario from "../models/user.model.mongo.js";

const router = express.Router();
const builder = new Builder();
const upload = multer({ storage: multer.memoryStorage() });

/* GET JSON */
router.get("/json", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al obtener usuarios", err: err.message });
  }
});

/* GET XML */
// router.get("/xml", async (req, res) => {
//   try {
//     const usuarios = await Usuario.find();
//     const xml = builder.buildObject({ usuarios });
//     res.set("Content-Type", "application/xml");
//     res.send(xml);
//   } catch (err) {
//     res.status(500).send(`<error>Error al obtener usuarios</error>`);
//   }
// });
router.get("/xml", async (req, res) => {
  try {
    const usuarios = await Usuario.find();

    const usuariosLimpios = usuarios.map((u) => ({
      id: u._id.toString(),
      nombre: u.nombre,
      email: u.email,
      contrasena: u.contrasena,
      cv: u.cv || "",
    }));

    const xml = builder.buildObject({ usuarios: { usuario: usuariosLimpios } });
    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    res.status(500).send(`<error>Error al obtener usuarios</error>`);
  }
});


/* POST JSON */
router.post("/json", upload.single("cv"), async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;
    const cv = req.file ? `uploads/${req.file.originalname}` : null;

    const nuevoUsuario = new Usuario({ nombre, email, contrasena, cv });
    await nuevoUsuario.save();

    res
      .status(201)
      .json({ mensaje: "Usuario creado", id: nuevoUsuario._id, cv });
  } catch (err) {
    res.status(500).json({ error: "Error al crear usuario", err: err.message });
  }
});

/* POST XML */
// router.post("/xml", upload.single("cv"), async (req, res) => {
//   try {
//     const { nombre, email, contrasena } = req.body;
//     const cv = req.file ? `uploads/${req.file.originalname}` : null;

//     const nuevoUsuario = new Usuario({ nombre, email, contrasena, cv });
//     await nuevoUsuario.save();

//     const xml = builder.buildObject({
//       mensaje: "Usuario creado",
//       id: nuevoUsuario._id,
//       cv,
//     });

//     res.set("Content-Type", "application/xml");
//     res.status(201).send(xml);
//   } catch (err) {
//     res
//       .status(500)
//       .set("Content-Type", "application/xml")
//       .send(`<error>Error al crear usuario: ${err.message}</error>`);
//   }
// });
router.post("/xml", upload.single("cv"), async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;
    const cv = req.file ? `uploads/${req.file.originalname}` : null;

    const nuevoUsuario = new Usuario({ nombre, email, contrasena, cv });
    await nuevoUsuario.save();

    const xml = builder.buildObject({
      mensaje: "Usuario creado",
      usuario: {
        id: nuevoUsuario._id.toString(),
        nombre,
        email,
        cv,
      },
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
