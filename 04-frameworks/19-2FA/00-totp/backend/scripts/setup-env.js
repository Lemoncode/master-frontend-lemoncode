const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env");
const envExamplePath = path.join(__dirname, "..", ".env.example");

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log("✅ Archivo .env creado desde .env.example");
    console.log("⚠️  Recuerda configurar las variables de entorno antes de ejecutar la aplicación");
  } else {
    console.warn("⚠️  No se encontró .env.example para crear .env");
  }
} else {
  console.log("ℹ️  El archivo .env ya existe");
}
