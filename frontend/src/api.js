const BASE_URL = "http://localhost:8000/api";

export async function getCandidates() {
  const res = await fetch(`${BASE_URL}/candidates`);
  return res.json();
}

export async function getKnownLaws() {
  const res = await fetch(`${BASE_URL}/known-laws`);
  return res.json();
}