#!/bin/bash
set -e

echo "Starting Ollama service..."
# Jalankan Ollama di background
ollama serve &

# Tunggu beberapa saat agar Ollama sempat inisialisasi (sesuaikan jika perlu)
sleep 5

echo "Starting Node.js API server..."
node server.js