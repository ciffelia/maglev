FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

RUN sed -i.bak -r 's@http://(deb|ftp\.jp)\.debian\.org/debian/?$@https://ftp.udx.icscoe.jp/Linux/debian/@g' /etc/apt/sources.list.d/debian.sources

# Dependencies for Puppeteer
# https://pptr.dev/troubleshooting#chrome-doesnt-launch-on-linux
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils && \
    rm -rf /var/lib/apt/lists/*
