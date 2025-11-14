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
    const usuarios = await Usuario.find().select("-contrasena");

    console.log(usuarios);

    res.status(200).json(usuarios);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al obtener usuarios", err: err.message });
  }
});

/* GET XML */

router.get("/xml", async (req, res) => {
  try {
    const usuarios = await Usuario.find();

    const usuariosLimpios = usuarios.map((u) => ({
      id: u._id.toString(),
      nombre: u.nombre,
      email: u.email,
      cv: u.cv || "",
    }));

    const xml = builder.buildObject({ usuarios: { usuario: usuariosLimpios } });
    res.set("Content-Type", "application/xml");
    res.status(200).send(xml);
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

    res.status(201).json({ mensaje: "Usuario creado", usuario: nuevoUsuario });
  } catch (err) {
    res.status(500).json({ error: "Error al crear usuario", err: err.message });
  }
});

/* POST XML */

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

/* GET JSON por ID */
router.get("/json/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-contrasena");
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(usuario);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al obtener usuario", err: err.message });
  }
});

/* GET XML por ID */
router.get("/xml/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res
        .status(404)
        .set("Content-Type", "application/xml")
        .send("<error>Usuario no encontrado</error>");
    }

    const usuarioLimpio = {
      id: usuario._id.toString(),
      nombre: usuario.nombre,
      email: usuario.email,
      cv: usuario.cv || "",
    };

    const xml = builder.buildObject({ usuario: usuarioLimpio });
    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    res
      .status(500)
      .set("Content-Type", "application/xml")
      .send(`<error>Error al obtener usuario: ${err.message}</error>`);
  }
});

/* DELETE JSON */
router.delete("/json/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res
        .status(404)
        .json({ error: "Usuario no encontrado para eliminar" });
    }
    res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al eliminar usuario", err: err.message });
  }
});

/* DELETE XML */
router.delete("/xml/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res
        .status(404)
        .set("Content-Type", "application/xml")
        .send("<error>Usuario no encontrado para eliminar</error>");
    }
    const xml = builder.buildObject({
      mensaje: "Usuario eliminado correctamente",
    });
    res.set("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (err) {
    res
      .status(500)
      .set("Content-Type", "application/xml")
      .send(`<error>Error al eliminar usuario: ${err.message}</error>`);
  }
});
/* PUT JSON */
router.put("/json/:id", upload.single("cv"), async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;
    let cv = req.file ? `uploads/${req.file.originalname}` : undefined; // Usamos undefined para no actualizar si no se envía un nuevo CV

    const datosActualizar = { nombre, email, contrasena };
    if (cv !== undefined) {
      // Solo añadimos el CV si se envió uno nuevo
      datosActualizar.cv = cv;
    }

    // `findByIdAndUpdate` busca por ID y actualiza. El tercer argumento `{ new: true }`
    // asegura que la función devuelva el documento actualizado, no el original.
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      datosActualizar,
      { new: true, runValidators: true } // `runValidators` para que se apliquen las validaciones del esquema
    ).select("-contrasena"); // No devolver la contraseña

    if (!usuarioActualizado) {
      return res
        .status(404)
        .json({ error: "Usuario no encontrado para actualizar" });
    }

    res
      .status(200)
      .json({
        mensaje: "Usuario actualizado correctamente",
        usuario: usuarioActualizado,
      });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al actualizar usuario", err: err.message });
  }
});

/* PUT XML */
router.put("/xml/:id", upload.single("cv"), async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;
    let cv = req.file ? `uploads/${req.file.originalname}` : undefined;

    const datosActualizar = { nombre, email, contrasena };
    if (cv !== undefined) {
      datosActualizar.cv = cv;
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      datosActualizar,
      { new: true, runValidators: true }
    );

    if (!usuarioActualizado) {
      return res
        .status(404)
        .set("Content-Type", "application/xml")
        .send("<error>Usuario no encontrado para actualizar</error>");
    }

    const usuarioLimpio = {
      id: usuarioActualizado._id.toString(),
      nombre: usuarioActualizado.nombre,
      email: usuarioActualizado.email,
      cv: usuarioActualizado.cv || "",
    };

    const xml = builder.buildObject({
      mensaje: "Usuario actualizado correctamente",
      usuario: usuarioLimpio,
    });

    res.set("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (err) {
    res
      .status(500)
      .set("Content-Type", "application/xml")
      .send(`<error>Error al actualizar usuario: ${err.message}</error>`);
  }
});

export default router;
