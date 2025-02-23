require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 5000;
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434/api/generate";
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434/api";
const DEFAULT_MODEL = process.env.OLLAMA_DEFAULT_MODEL || "deepseek-r1:1.5b";

app.use(express.json());
app.use(cors());

// 🔹 Route to Check API Status
app.get("/", (req, res) => {
  res.json({ message: `✅ Ollama API is running with model: ${DEFAULT_MODEL}` });
});

// 🔹 Route to List Available Models
app.get("/models", async (req, res) => {
  try {
    const response = await axios.get(`${OLLAMA_BASE_URL}/tags`);
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching models:", error.message);
    res.status(500).json({ error: "Failed to fetch available models" });
  }
});

// 🔹 Route to Generate a Response Using Default Model
app.post("/chat", async (req, res) => {
  const { prompt, stream } = req.body;
  const model = DEFAULT_MODEL; // Always use the default model

  if (!prompt) {
    return res.status(400).json({ error: "❌ Prompt is required" });
  }

  try {
    const response = await axios.post(OLLAMA_API_URL, {
      model,
      prompt,
      stream: stream || false, // Default to false if not provided
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error generating response:", error.message);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

// 🔹 Route to Pull a New Model (if needed)
app.post("/pull-model", async (req, res) => {
  try {
    const response = await axios.post(`${OLLAMA_BASE_URL}/pull`, { name: DEFAULT_MODEL });

    res.json({ success: true, message: `✅ Model ${DEFAULT_MODEL} pulled successfully`, response: response.data });
  } catch (error) {
    console.error("❌ Error pulling model:", error.message);
    res.status(500).json({ error: `Failed to pull model ${DEFAULT_MODEL}` });
  }
});

// 🔹 Start the Server with a Creative Terminal Message
app.listen(PORT, () => {
  console.clear(); // Clear console for a fresh start

  const banner = `
  ██████╗  █████╗ ██╗      █████╗ ███╗   ███╗ █████╗ 
  ██╔══██╗██╔══██╗██║     ██╔══██╗████╗ ████║██╔══██╗
  ██████╔╝███████║██║     ███████║██╔████╔██║███████║
  ██╔═══╝ ██╔══██║██║     ██╔══██║██║╚██╔╝██║██╔══██║
  ██║     ██║  ██║███████╗██║  ██║██║ ╚═╝ ██║██║  ██║
  ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝

  🚀 Ollama API is running! Access it at: http://localhost:${PORT}  
  🤖 Model Loaded: ${DEFAULT_MODEL}  
  🖥️ Running on: ${os.hostname()} | ${os.platform()} | ${os.arch()}
  🔄 Restart to refresh server logs.
  `;

  console.log("\x1b[36m%s\x1b[0m", banner); // Cyan text
});
