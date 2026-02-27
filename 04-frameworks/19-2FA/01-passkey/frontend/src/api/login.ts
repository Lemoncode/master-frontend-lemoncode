const API_BASE = "http://localhost:3000/api/login";

export async function loginStart(email: string) {
  const response = await fetch(`${API_BASE}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Error al iniciar login");
  }

  return response.json();
}

export async function loginFinish(email: string, credential: unknown) {
  const response = await fetch(`${API_BASE}/finish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, credential }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Error al finalizar login");
  }

  return response.json();
}
