require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 5000;
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434/api/generate";
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434/api";
const DEFAULT_MODEL = process.env.OLLAMA_DEFAULT_MODEL || "smollm:135m";

app.use(express.json());
app.use(cors());

// Buat router untuk semua endpoint API dengan prefix /api
const router = express.Router();

// 🔹 Route untuk Check API Status
router.get("/", (req, res) => {
  res.json({ message: `✅ Ollama API is running with model: ${DEFAULT_MODEL}` });
});

// 🔹 Route untuk List Available Models
router.get("/models", async (req, res) => {
  try {
    const response = await axios.get(`${OLLAMA_BASE_URL}/tags`);
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching models:", error.message);
    res.status(500).json({ error: "Failed to fetch available models" });
  }
});

// 🔹 Route untuk Generate AI Response
router.post("/chat", async (req, res) => {
  const { prompt, stream } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "❌ Prompt is required" });
  }
  try {
    const response = await axios.post(OLLAMA_API_URL, {
      model: DEFAULT_MODEL,
      prompt,
      stream: stream || false,
    });
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error generating response:", error.message);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

// 🔹 Route untuk Pull a Model dari Ollama
router.post("/pull-model", async (req, res) => {
  try {
    const response = await axios.post(`${OLLAMA_BASE_URL}/pull`, { name: DEFAULT_MODEL });
    res.json({ success: true, message: `✅ Model ${DEFAULT_MODEL} pulled successfully`, response: response.data });
  } catch (error) {
    console.error("❌ Error pulling model:", error.message);
    res.status(500).json({ error: `Failed to pull model ${DEFAULT_MODEL}` });
  }
});

// Mount router dengan prefix /api
app.use("/api", router);

app.listen(PORT, () => {
  console.clear(); // Clear console for fresh start

  const banner = `
  ██████╗  █████╗ ██╗      █████╗ ███╗   ███╗ █████╗ 
  ██╔══██╗██╔══██╗██║     ██╔══██╗████╗ ████║██╔══██╗
  ██████╔╝███████║██║     ███████║██╔████╔██║███████║
  ██╔═══╝ ██╔══██║██║     ██╔══██║██║╚██╔╝██║██╔══██║
  ██║     ██║  ██║███████╗██║  ██║██║ ╚═╝ ██║██║  ██║
  ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝

  🚀 Node.js API is running on port ${PORT} with model: ${DEFAULT_MODEL}
  🖥️ Running on: ${os.hostname()} | ${os.platform()} | ${os.arch()}
  🔄 Restart to refresh server logs.
  `;
  console.log("\x1b[36m%s\x1b[0m", banner); // Cyan text
});