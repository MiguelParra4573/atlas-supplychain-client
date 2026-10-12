# syntax=docker/dockerfile:1

# 1) Build: compila el bundle estático con Vite.
FROM node:24-alpine AS build
WORKDIR /app

# Las dependencias se copian aparte para que la capa de npm ci se reutilice entre builds.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# 2) Runtime: nginx sirve el bundle y proxya /api/v1 al backend.
FROM nginx:1.29-alpine
# La imagen procesa los templates con envsubst al arrancar (ver nginx/default.conf.template).
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

ENV API_UPSTREAM=http://auth-server:9000
EXPOSE 80
