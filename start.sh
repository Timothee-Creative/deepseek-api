#!/bin/bash
set -e

echo "Starting Ollama service..."
# Jalankan service Ollama secara background
ollama serve &

# Tunggu beberapa detik agar Ollama selesai inisialisasi
sleep 5

echo "Loading model (smollm:135m)..."
# Jalankan model DeepSeek secara background agar model tersedia di Ollama
ollama run smollm:135m &

# Tunggu beberapa detik agar model selesai inisialisasi
sleep 5

echo "Starting Open WebUI (port 8080)..."
# Mulai open-webui (defaultnya akan berjalan pada port 8080)
open-webui serve &

# Tunggu beberapa detik agar open-webui selesai inisialisasi
sleep 5

echo "Starting Node.js API server..."
node server.js