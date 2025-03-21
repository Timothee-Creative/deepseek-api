# Gunakan image Node.js (sesuaikan versi sesuai kebutuhan)
FROM node:16

# Install dependency sistem yang dibutuhkan (curl, tar, python3, python3-pip, git)
RUN apt-get update && apt-get install -y curl tar python3 python3-pip git

# Set direktori kerja
WORKDIR /app

# Salin package.json dan package-lock.json untuk install dependency Node.js
COPY package*.json ./
RUN npm install

# Salin seluruh kode aplikasi ke dalam image
COPY . .

# Upgrade pip dan instal open-webui langsung dari GitHub menggunakan opsi PEP517
RUN pip3 install --upgrade pip && \
    pip3 install --use-pep517 git+https://github.com/open-webui/open-webui.git

# Jika file .env belum ada, salin dari .env.example
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# Install Ollama (sesuai dokumentasi resmi untuk Linux AMD64)
RUN curl -L https://ollama.com/download/ollama-linux-amd64.tgz -o ollama.tgz && \
    tar -C /usr -xzf ollama.tgz && \
    rm ollama.tgz

# Ekspose port untuk API Node.js (5000), Ollama (11434), dan Open WebUI (8080)
EXPOSE 5000 11434 8080

# Salin skrip startup dan beri hak akses eksekusi
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Perintah yang dijalankan saat container dijalankan
CMD ["/start.sh"]