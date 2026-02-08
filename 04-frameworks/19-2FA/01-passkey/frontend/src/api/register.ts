const API_BASE = "http://localhost:3000/api/register";

export async function registerStart(email: string) {
  const response = await fetch(`${API_BASE}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Error al iniciar registro");
  }

  return response.json();
}

export async function registerFinish(email: string, credential: unknown) {
  const response = await fetch(`${API_BASE}/finish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, credential }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Error al finalizar registro");
  }

  return response.json();
}
