// API Health Check Script
// Run with: bun api-health-check.js

const API_BASE_URL = "http://localhost:5001";
const HEALTH_ENDPOINT = "/health";
const AUTH_LOGIN_ENDPOINT = "/api/v1/Auth/login";

async function checkEndpoint(url, options = {}) {
  console.log(`Checking: ${url}`);
  try {
    const response = await fetch(url, options);
    console.log(`Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      try {
        const data = await response.json();
        console.log("Response:", JSON.stringify(data, null, 2));
      } catch (e) {
        console.log("Response is not JSON");
      }
    } else {
      console.log("Error response");
    }

    return response.ok;
  } catch (error) {
    console.error(`Failed to connect: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log("=== API Health Check ===");
  console.log(`API Base URL: ${API_BASE_URL}`);

  console.log("\n--- Health Endpoint ---");
  const healthOk = await checkEndpoint(`${API_BASE_URL}${HEALTH_ENDPOINT}`);

  console.log("\n--- Auth Login Endpoint (OPTIONS) ---");
  await checkEndpoint(`${API_BASE_URL}${AUTH_LOGIN_ENDPOINT}`, {
    method: "OPTIONS",
  });

  console.log("\n--- Overall Status ---");
  if (healthOk) {
    console.log("✅ Health endpoint is working");
  } else {
    console.log("❌ Health endpoint is not available");
  }
  console.log(
    "\nNote: For actual API calls, use proper authentication and request bodies"
  );
}

main().catch(console.error);
