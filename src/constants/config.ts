// MelanoLens hosted FastAPI backend (Azure Web Apps, MobileNetV2-only).
// Swap this single value to switch the API target.
const ENV_BACKEND_URL =
  'https://melanolens-be-b9hwazeycfayg9ee.indonesiacentral-01.azurewebsites.net';

// Dev fallback: local backend on the dev machine's LAN IP (192.168.1.13).
// Set to true to run against a local uvicorn on :8000.
const USE_LOCAL_BACKEND = false;
const LOCAL_MACHINE_IP = '192.168.1.13';

export const API_BASE_URL = USE_LOCAL_BACKEND
  ? `http://${LOCAL_MACHINE_IP}:8000`
  : ENV_BACKEND_URL;