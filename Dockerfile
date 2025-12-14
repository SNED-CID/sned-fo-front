FROM node:20-alpine AS build

WORKDIR /app

# Copier et installer dépendances
COPY package*.json ./
RUN npm ci --ignore-scripts && \
    npm cache clean --force

# Copier code source et builder
COPY . .
RUN npm run build -- --configuration=production

# Stage final : Nginx
FROM nginx:1.27-alpine

# Metadata
LABEL maintainer="SNED Team" \
      description="SNED Front Office Frontend" \
      version="1.0.0"

# Installer curl
RUN apk add --no-cache curl && \
    rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Copier configurations
COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx nginx-default.conf /etc/nginx/conf.d/default.conf

# Copier app buildée
COPY --from=build --chown=nginx:nginx /app/dist/sned-fo-front /usr/share/nginx/html

# Permissions et dossiers temporaires
RUN mkdir -p /var/cache/nginx/{client,proxy,fastcgi,uwsgi,scgi}_temp && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /etc/nginx/conf.d /usr/share/nginx/html && \
    chmod -R 755 /var/cache/nginx /var/log/nginx

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
