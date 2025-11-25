import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(dirname(__filename), "..");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Talento Lab",
      version: "1.0.0",
    },
    servers: [
      {
        // 2. Aquí usamos la variable de entorno
        // Usamos '||' para tener un valor por defecto si la variable no existe
        url: process.env.SERVER_URL || "http://localhost:3000",
        description: "Servidor Principal",
      },
    ],
  },
  apis: ["./routes/*.js", "./swagger.yaml"],
};
const optionsUI = {
  // 1. PERSONALIZACIÓN VISUAL (CSS)
  // Puedes pasar string de CSS directo o una URL
  customCss: `
    .swagger-ui .topbar { display: none }  /* Ocultar la barra verde superior de Swagger */
    .swagger-ui .info { margin: 20px 0; }
    .swagger-ui .btn.authorize { background-color: #FF5722; color: white; border-color: #FF5722; }
    body { background-color: #fafafa; }
  `,
  // Si prefieres cargar un archivo CSS externo:
  customCssUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",

  // 2. BRANDING (Título de la pestaña y Favicon)
  customSiteTitle: "Documentación Talento Lab",
  customfavIcon: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png", // URL de tu icono

  // 3. OPCIONES DE COMPORTAMIENTO
  swaggerOptions: {
    // 'none' = Todo colapsado | 'list' = Solo expande las tags | 'full' = Todo abierto
    docExpansion: "none",

    // Filtro de búsqueda activado
    filter: false,

    // -1 oculta la sección "Schemas" al final. Pon 1 para mostrarla.
    defaultModelsExpandDepth: 1,

    // Desactiva el botón "Try it out" si solo quieres que sea lectura
    supportedSubmitMethods: [],
  },
};

export { join, __dirname, swaggerOptions, optionsUI };
