import express from "express";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const app = express();
app.use(express.json());

app.use("/", express.static(path.resolve(import.meta.dirname, "graphql")));

app.post("/graphql", async (req, res) => {
  if (!GITHUB_TOKEN) {
    res.status(500).json({
      error: "Token de GitHub no configurado",
      message: "Crea un archivo .env con tu GITHUB_TOKEN. Ver .env.example",
    });
    return;
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "User-Agent": "GraphQL-Learning-App",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({
      error: "Error al conectar con la API de GitHub",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 GraphiQL disponible en http://localhost:${PORT}`);

  if (!GITHUB_TOKEN) {
    console.log(
      `\n⚠️  IMPORTANTE: Configura tu GITHUB_TOKEN en el archivo .env`,
    );
    console.log(`   1. Copia .env.example a .env`);
    console.log(`   2. Añade tu token de GitHub`);
  } else {
    console.log(`\n✅ Token de GitHub configurado correctamente`);
  }
});
