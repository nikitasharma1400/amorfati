const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function handle(response) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({ detail: "Something went wrong" }));
    throw new Error(body.detail || "Something went wrong");
  }
  return response.json();
}

export async function sealLetter(formData) {
  const response = await fetch(`${BASE_URL}/api/letters`, {
    method: "POST",
    body: formData,
  });
  return handle(response);
}

export async function getStatus(id) {
  const response = await fetch(`${BASE_URL}/api/letters/${id}/status`);
  return handle(response);
}

export async function verifyLetter(id, secretToken, password) {
  const response = await fetch(`${BASE_URL}/api/letters/${id}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret_token: secretToken, password }),
  });
  return handle(response);
}

export async function openLetter(id, secretToken, password) {
  const response = await fetch(`${BASE_URL}/api/letters/${id}/open`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret_token: secretToken, password }),
  });
  return handle(response);
}

export function photoUrl(path) {
  if (!path) return null;
  return `${BASE_URL}${path}`;
}
