const ANKI_API_URL = "http://localhost:8765";

async function callAnkiConnect(action, params = {}) {
  try {
    const response = await fetch(ANKI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        version: 6,
        params,
      }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(`AnkiConnect Error: ${data.error}`);
    }
    return data.result;
  } catch (error) {
    console.error(`AnkiConnect failed: ${action}`, error.message);
    throw error;
  }
}

module.exports = { callAnkiConnect };
