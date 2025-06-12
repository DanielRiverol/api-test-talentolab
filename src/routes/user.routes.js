// // routes/usuarioRoutes.js
// import express from "express";
// import { Builder, parseStringPromise } from "xml2js";
// import UsuarioModel from "../models/user.model.js";

// const router = express.Router();
// const builder = new Builder();

// // GET JSON
// router.get("/json", async (req, res) => {
//   try {
//     const usuarios = await UsuarioModel.obtenerTodos();
//     res.json(usuarios);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Error al obtener usuarios", err: err.message });
//   }
// });

// // GET XML
// router.get("/xml", async (req, res) => {
//   try {
//     const usuarios = await UsuarioModel.obtenerTodos();
//     const xml = builder.buildObject({ usuarios });
//     res.set("Content-Type", "application/xml");
//     res.send(xml);
//   } catch (err) {
//     res.status(500).send(`<error>Error al obtener usuarios</error>`);
//   }
// });

// // POST JSON
// router.post("/json", async (req, res) => {
//   try {
//     const { nombre, email, contrasena, cv } = req.body;
//     const id = await UsuarioModel.crear({ nombre, email, contrasena, cv });
//     res.status(201).json({ mensaje: "Usuario creado", id });
//   } catch (err) {
//     res.status(500).json({ error: "Error al crear usuario", err: err.message });
//   }
// });

// // POST XML
// router.post(
//   "/xml",
//   express.text({ type: "application/xml" }),
//   async (req, res) => {
//     try {
//       const jsonBody = await parseStringPromise(req.body, {
//         explicitArray: false,
//       });
//       const { nombre, email, contrasena, cv } = jsonBody.usuario;

//       const id = await UsuarioModel.crear({ nombre, email, contrasena, cv });

//       const xml = builder.buildObject({
//         mensaje: "Usuario creado",
//         id,
//       });

//       res.set("Content-Type", "application/xml");
//       res.status(201).send(xml);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send(`<error>Error al crear usuario</error>`);
//     }
//   }
// );

// export default router;
// routes/usuarioRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import { Builder, parseStringPromise } from "xml2js";
import UsuarioModel from "../models/user.model.js";

const router = express.Router();
const builder = new Builder();

// Configuración de multer
const storage = multer.diskStorage({
  destination: "src/uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = file.fieldname + "-" + Date.now() + ext;
    cb(null, safeName);
  },
});

const upload = multer({ storage });

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
/* POST JSON con archivo */
// POST que recibe datos sueltos y devuelve JSON
router.post("/json", upload.single("cv"), async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;

    if (!nombre || !email || !contrasena) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const cvUrl = req.file ? `src/uploads/${req.file.filename}` : null;

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

// POST que recibe datos sueltos y devuelve XML
router.post("/xml", upload.single("cv"), async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;

    if (!nombre || !email || !contrasena) {
      return res
        .status(400)
        .set("Content-Type", "application/xml")
        .send(`<error>Faltan campos obligatorios</error>`);
    }

    const cvUrl = req.file ? `src/uploads/${req.file.filename}` : null;

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
