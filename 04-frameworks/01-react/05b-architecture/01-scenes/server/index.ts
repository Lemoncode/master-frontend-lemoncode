import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import { z } from "zod";

// ────────────────────────────────────────────────────────────────
// Configuración
// ────────────────────────────────────────────────────────────────
// Puerto del servidor. Se puede cambiar con la variable de entorno PORT.
const PORT = Number(process.env.PORT ?? 3000);
const RICK_AND_MORTY_API = "https://rickandmortyapi.com/api";
const SESSION_COOKIE = "session";
const JWT_SECRET = "esto-en-un-proyecto-real-va-en-un-secreto";

// Usuarios de mentira. En un proyecto real esto es una base de datos.
const users = [{ username: "admin", password: "test", name: "Rick Sanchez" }];

// Pon BREAK_API=true al arrancar para que la API devuelva el modelo cambiado.
// Sirve para ver saltar la validación de zod en el front.
const BREAK_API = process.env.BREAK_API === "true";

// Interruptor de caos: cuando está encendido, /api/characters falla.
// Se enciende y se apaga en caliente con POST /api/chaos, sin reiniciar nada.
let chaos = false;

// Retardo artificial para que se vean los estados de carga en clase.
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface SessionUser {
  username: string;
  name: string;
}

const app = new Hono();

// Enciende o apaga el modo caos:  curl -X POST http://localhost:3000/api/chaos
app.post("/api/chaos", (c) => {
  chaos = !chaos;
  console.log(
    chaos
      ? "💥 Modo caos ENCENDIDO: /api/characters devolverá 500"
      : "✅ Modo caos apagado",
  );
  return c.json({ chaos });
});

// Ping: sirve para comprobar desde el front que el servidor está vivo.
app.get("/api/health", (c) =>
  c.json({ status: "ok", name: "Rick & Morty Lab API" }),
);

// ────────────────────────────────────────────────────────────────
// Autenticación
// ────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  username: z.string().min(1, "El usuario es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

app.post("/api/login", async (c) => {
  await delay(800);

  const result = loginSchema.safeParse(await c.req.json().catch(() => ({})));

  if (!result.success) {
    return c.json({ message: "Faltan datos en la petición" }, 400);
  }

  const { username, password } = result.data;
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (!user) {
    return c.json({ message: "Usuario o contraseña no válidos" }, 401);
  }

  const token = await sign(
    {
      sub: user.username,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    JWT_SECRET,
  );

  // httpOnly: el JavaScript de la página NO puede leer esta cookie.
  // Es lo que la protege de un ataque XSS.
  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60,
  });

  return c.json({ username: user.username, name: user.name });
});

app.post("/api/logout", (c) => {
  deleteCookie(c, SESSION_COOKIE, { path: "/" });
  return c.json({ message: "Sesión cerrada" });
});

const readSession = async (token?: string): Promise<SessionUser | null> => {
  if (!token) {
    return null;
  }

  try {
    const payload = await verify(token, JWT_SECRET, "HS256");
    return { username: payload.sub as string, name: payload.name as string };
  } catch {
    return null;
  }
};

// Quién soy: el front lo llama al arrancar para saber si hay sesión abierta.
app.get("/api/me", async (c) => {
  const user = await readSession(getCookie(c, SESSION_COOKIE));

  return user ? c.json(user) : c.json({ message: "No autenticado" }, 401);
});

// ────────────────────────────────────────────────────────────────
// Personajes (pasamos por la API de Rick & Morty)
// ────────────────────────────────────────────────────────────────

// Así es como viene el personaje de la API pública. Nosotros le damos
// al front una versión más plana y más corta.
interface ApiCharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  origin: { name: string };
  location: { name: string };
  episode: string[];
}

interface ApiCharacterPage {
  info: { pages: number; count: number };
  results: ApiCharacter[];
}

interface ApiEpisode {
  id: number;
  name: string;
  episode: string;
  air_date: string;
}

app.get("/api/characters", async (c) => {
  await delay(600);

  // Modo caos: el servidor contesta, pero con un error.
  if (chaos) {
    return c.json({ message: "Algo ha explotado en el servidor" }, 500);
  }

  const page = c.req.query("page") ?? "1";
  const name = c.req.query("name") ?? "";

  const response = await fetch(
    `${RICK_AND_MORTY_API}/character?page=${page}&name=${encodeURIComponent(name)}`,
  );

  if (response.status === 404) {
    return c.json({ info: { pages: 0, count: 0 }, results: [] });
  }

  const data = (await response.json()) as ApiCharacterPage;

  const results = data.results.map((character) => ({
    // BREAK_API=true renombra el campo: el front deja de encontrarlo
    // y zod lo caza en la frontera en vez de romper la pantalla.
    ...(BREAK_API ? { characterId: character.id } : { id: character.id }),
    name: character.name,
    status: character.status,
    species: character.species,
    gender: character.gender,
    image: character.image,
    origin: character.origin.name,
    location: character.location.name,
    episodeCount: character.episode.length,
  }));

  return c.json({
    info: { pages: data.info.pages, count: data.info.count },
    results,
  });
});

app.get("/api/characters/:id", async (c) => {
  await delay(600);

  const response = await fetch(
    `${RICK_AND_MORTY_API}/character/${c.req.param("id")}`,
  );

  if (!response.ok) {
    return c.json({ message: "Personaje no encontrado" }, 404);
  }

  const character = (await response.json()) as ApiCharacter;

  // Los episodios llegan como urls: los pedimos para dar el nombre.
  const episodeUrls: string[] = character.episode.slice(0, 5);
  const episodes = await Promise.all(
    episodeUrls.map((url) =>
      fetch(url).then((res) => res.json() as Promise<ApiEpisode>),
    ),
  );

  return c.json({
    id: character.id,
    name: character.name,
    status: character.status,
    species: character.species,
    gender: character.gender,
    image: character.image,
    origin: character.origin.name,
    location: character.location.name,
    episodeCount: character.episode.length,
    episodes: episodes.map((episode) => ({
      id: episode.id,
      name: episode.name,
      episode: episode.episode,
      airDate: episode.air_date,
    })),
  });
});

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`🛸 Servidor escuchando en http://localhost:${info.port}`);
  if (BREAK_API) {
    console.log(
      "⚠️  BREAK_API activo: /api/characters devuelve el modelo cambiado",
    );
  }
});
