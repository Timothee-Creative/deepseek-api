#!/bin/bash
set -e

echo "Starting Ollama service..."
# Jalankan service Ollama secara background
ollama serve &

# Tunggu beberapa detik agar Ollama selesai inisialisasi
sleep 5

echo "Loading DeepSeek model (deepseek-r1:7b)..."
# Jalankan model DeepSeek secara background agar model tersedia di Ollama
ollama run deepseek-r1:7b &

# Tunggu beberapa detik agar model selesai inisialisasi
sleep 5

echo "Starting Node.js API server..."
node server.js