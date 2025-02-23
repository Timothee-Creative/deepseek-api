# Gunakan image Node.js (sesuaikan versi sesuai kebutuhan)
FROM node:16

# Set direktori kerja
WORKDIR /app

# Install dependency sistem yang dibutuhkan (curl, tar)
RUN apt-get update && apt-get install -y curl tar

# Salin package.json dan package-lock.json untuk install dependency Node.js
COPY package*.json ./
RUN npm install

# Salin seluruh kode aplikasi ke dalam image
COPY . .

# Jika file .env belum ada, salin dari .env.example
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# Install Ollama (sesuai dokumentasi resmi untuk Linux AMD64)
RUN curl -L https://ollama.com/download/ollama-linux-amd64.tgz -o ollama.tgz && \
    tar -C /usr -xzf ollama.tgz && \
    rm ollama.tgz

# Ekspose port untuk API Node.js (5000) dan Ollama (11434)
EXPOSE 5000 11434

# Salin skrip startup dan beri hak akses eksekusi
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Perintah yang dijalankan saat container dijalankan
CMD ["/start.sh"]