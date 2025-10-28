// src/api.ts
const API_BASE_URL = "http://localhost:5000/api";

export async function fetchWithAuth(endpoint: string, token: string) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // Check content type before parsing
  const contentType = res.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Expected JSON but got ${contentType}. Response: ${text.substring(0, 100)}`);
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Fetch failed: ${res.status} - ${errText}`);
  }

  return res.json();
}

export async function postWithAuth(endpoint: string, token: string, body: any) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  });

  const contentType = res.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Expected JSON but got ${contentType}. Response: ${text.substring(0, 100)}`);
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Fetch failed: ${res.status} - ${errText}`);
  }

  return res.json();
}