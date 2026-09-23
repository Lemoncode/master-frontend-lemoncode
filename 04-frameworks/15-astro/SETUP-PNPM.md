# Guía de instalación: Node.js y pnpm

Antes de arrancar cualquier proyecto del curso, necesitas tener instalados **Node.js** y **pnpm** en tu equipo. Esta guía te explica cómo hacerlo paso a paso.

---

## ¿Qué es Node.js?

Node.js es el entorno que permite ejecutar JavaScript fuera del navegador. Astro lo usa en segundo plano para compilar tu proyecto y arrancar el servidor de desarrollo. No necesitas saber usarlo directamente; sólo necesitas tenerlo instalado.

**Versión recomendada: Node.js 24.15 LTS**

LTS significa _Long Term Support_: es la versión más estable y con soporte más largo. Es la que recomendamos para el curso.

> Astro 6 requiere como mínimo Node.js 22.12.0. Si ya tienes una versión igual o superior, también funciona.

---

## ¿Qué es pnpm?

pnpm es un gestor de paquetes para Node.js, igual que `npm` o `yarn`, pero con varias ventajas:

- **Más rápido**: instala dependencias en paralelo de forma más eficiente.
- **Ahorra espacio en disco**: cuando varios proyectos usan el mismo paquete, pnpm lo guarda una sola vez en un almacén compartido y crea enlaces en cada proyecto, en lugar de copiar los archivos.
- **Estricto con peer dependencies**: avisa cuando algo no está bien declarado, lo que evita bugs difíciles de depurar.

En este curso usamos **pnpm** en lugar de `npm`.

---

## 1. Instalar Node.js 24.15 LTS

### Opción A — Descarga directa (recomendada para principiantes)

1. Ve a [https://nodejs.org](https://nodejs.org).
2. Descarga el instalador de la versión **24.15 LTS**.
3. Ejecuta el instalador y sigue los pasos (siguiente, siguiente, instalar).
4. Cierra y vuelve a abrir la terminal para que los cambios tengan efecto.

### Opción B — nvm (recomendada si trabajas con varios proyectos)

`nvm` (Node Version Manager) te permite tener varias versiones de Node.js instaladas y cambiar entre ellas fácilmente.

**macOS / Linux:**

```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Cerrar y reabrir la terminal, después:
nvm install 24.15
nvm use 24.15
nvm alias default 24.15
```

**Windows:** usa [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) (descarga el instalador `.exe`).

```powershell
nvm install 24.15
nvm use 24.15
```

### Verificar la instalación

```bash
node --version
# Debe mostrar v24.15.x
```

---

## 2. Instalar pnpm

Una vez que tienes Node.js instalado, puedes instalar pnpm de varias formas:

### Opción A — Con npm (la más sencilla)

```bash
npm install -g pnpm
```

### Opción B — Con Corepack (integrado en Node.js 16+)

Corepack es una herramienta incluida en Node.js que gestiona versiones de pnpm y yarn automáticamente:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### Opción C — Con Homebrew (macOS)

```bash
brew install pnpm
```

### Opción D — Con Scoop (Windows)

```powershell
scoop install nodejs-lts
scoop install pnpm
```

### Verificar la instalación

```bash
pnpm --version
# Debe mostrar 9.x.x o superior
```

---

## 3. Equivalencias npm → pnpm

Si estás acostumbrado a npm, aquí tienes la tabla de equivalencias para los comandos más habituales:

| Qué quieres hacer                  | Con npm                    | Con pnpm                    |
| ---------------------------------- | -------------------------- | --------------------------- |
| Crear proyecto Astro               | `npm create astro@latest`  | `pnpm create astro@latest`  |
| Instalar dependencias del proyecto | `npm install`              | `pnpm install`              |
| Añadir una dependencia             | `npm install <paquete>`    | `pnpm add <paquete>`        |
| Añadir dependencia de desarrollo   | `npm install -D <paquete>` | `pnpm add -D <paquete>`     |
| Arrancar el servidor de desarrollo | `npm run dev`              | `pnpm dev`                  |
| Compilar para producción           | `npm run build`            | `pnpm build`                |
| Vista previa del build             | `npm run preview`          | `pnpm preview`              |
| Ejecutar herramientas sin instalar | `npx <herramienta>`        | `pnpm dlx <herramienta>`    |
| Actualizar Astro                   | `npx @astrojs/upgrade`     | `pnpm dlx @astrojs/upgrade` |

> **Nota:** con pnpm puedes omitir `run` para scripts como `dev`, `build` y `preview`. Es decir, `pnpm dev` es lo mismo que `pnpm run dev`.

---

## 4. Cómo arrancar cualquier proyecto del curso

Todos los ejemplos del curso siguen el mismo flujo:

```bash
# 1. Entra en la carpeta del ejemplo
cd 00-fundamentos/00-creando-proyecto

# 2. Instala las dependencias
pnpm install

# 3. Arranca el servidor de desarrollo
pnpm dev
```

Abre el navegador en `http://localhost:4321` y verás el proyecto en marcha.

---

## Solución de problemas frecuentes

**"pnpm: command not found"**
→ Cierra la terminal y ábrela de nuevo. Si sigue sin funcionar, comprueba que Node.js está instalado correctamente con `node --version`.

**Error de permisos al instalar pnpm globalmente en Linux/macOS**
→ No uses `sudo`. En su lugar, usa nvm para gestionar Node.js (opción B de la sección anterior): con nvm los paquetes globales se instalan en tu carpeta de usuario sin necesitar permisos de administrador.

**La versión de Node.js no cambia tras instalar con nvm**
→ Ejecuta `nvm use 24.15` en la terminal actual, o añade `nvm alias default 24.15` para que sea permanente.

**"ERR_PNPM_UNSUPPORTED_ENGINE" al instalar dependencias**
→ El proyecto requiere Node.js ≥22.12.0. Actualiza tu versión de Node.js siguiendo los pasos de esta guía.

**Aviso `approve-builds` durante `pnpm install`**
→ pnpm v9+ pregunta antes de ejecutar scripts de instalación de paquetes como `sharp`. Escribe `y` y pulsa Enter. Si el prompt ya desapareció o la instalación quedó incompleta, ejecuta `pnpm approve-builds`.
