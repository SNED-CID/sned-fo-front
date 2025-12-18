FROM node:20-alpine AS build

WORKDIR /app

# Copier et installer dépendances
COPY package*.json ./
RUN npm ci --ignore-scripts && \
    npm cache clean --force

# Copier code source et builder
COPY . .
RUN npm run build -- --configuration=production

# Stage final : Nginx avec SSL
FROM nginx:1.27-alpine

# Metadata
LABEL maintainer="SNED Team" \
      description="SNED Front Office Frontend with SSL" \
      version="1.0.0"

# Installer curl et openssl
RUN apk add --no-cache curl openssl && \
    rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Note: nginx.conf et nginx-ssl.conf sont montés via volumes depuis infra/configs/nginx/fo/
# Voir docker-compose-fo.yml pour la configuration des volumes

# Copier certificats SSL
COPY --chown=nginx:nginx ssl/server.crt /etc/nginx/ssl/server.crt
COPY --chown=nginx:nginx ssl/server.key /etc/nginx/ssl/server.key

# Sécuriser les certificats
RUN chmod 644 /etc/nginx/ssl/server.crt && \
    chmod 600 /etc/nginx/ssl/server.key

# Copier app buildée
COPY --from=build --chown=nginx:nginx /app/dist/sned-fo-front /usr/share/nginx/html

# Permissions et dossiers temporaires
RUN mkdir -p /var/cache/nginx/{client,proxy,fastcgi,uwsgi,scgi}_temp && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /etc/nginx/conf.d /usr/share/nginx/html /etc/nginx/ssl && \
    chmod -R 755 /var/cache/nginx /var/log/nginx

USER nginx

EXPOSE 8080 443

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f -k https://localhost:443/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
