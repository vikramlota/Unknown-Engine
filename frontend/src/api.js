// Dynamic Base URL resolver:
// - If VITE_API_BASE_URL is configured (e.g. in Vercel project settings or .env), use it.
// - Defaults to "/api" for same-domain Vercel serverless deployment and Vite dev proxy.
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) {
    return "/api";
  }
  const clean = envUrl.replace(/\/+$/, "");
  return clean.endsWith("/api") ? clean : `${clean}/api`;
};

const BASE_URL = getBaseUrl();

export async function getCandidates() {
  const res = await fetch(`${BASE_URL}/candidates`);
  return res.json();
}

export async function getKnownLaws() {
  const res = await fetch(`${BASE_URL}/known-laws`);
  return res.json();
}

export async function triggerNasaFetch() {
  const res = await fetch(`${BASE_URL}/fetch-nasa-data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }
  return res.json();
}

export async function getAiReport(candidateId) {
  const res = await fetch(`${BASE_URL}/ai/report/${candidateId}`);
  if (!res.ok) {
    throw new Error(`Failed to generate AI report for candidate ${candidateId}`);
  }
  return res.json();
}

export async function getRawData(page = 1, limit = 50, search = "") {
  let url = `${BASE_URL}/raw-data?page=${page}&limit=${limit}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch raw dataset");
  }
  return res.json();
}

export async function getEdaAnalysis() {
  const res = await fetch(`${BASE_URL}/eda`);
  if (!res.ok) {
    throw new Error("Failed to load EDA analysis");
  }
  return res.json();
}

export async function getXaiAnalysis(candidateId) {
  const res = await fetch(`${BASE_URL}/xai/${candidateId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch XAI analysis for candidate ${candidateId}`);
  }
  return res.json();
}

export async function getDiscoverableLaws() {
  const res = await fetch(`${BASE_URL}/discoverable-laws`);
  if (!res.ok) {
    throw new Error("Failed to fetch discoverable physical laws catalog");
  }
  return res.json();
}