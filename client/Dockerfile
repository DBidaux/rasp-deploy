# syntax=docker/dockerfile:1

# Usa una imagen de Node.js compatible con ARM para la primera etapa
FROM node:current-alpine AS build

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia package.json e instala las dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copia los archivos y construye la aplicación (React-scripts)
COPY . .
RUN npm run build

# Usa una imagen de Node.js compatible con ARM para la segunda etapa
FROM node:current-alpine

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de construcción desde la etapa de build
COPY --from=build /usr/src/app/build ./build

# Instala 'serve' para servir la aplicación (estático)
RUN npm install -g serve

# Expone el puerto y establece el comando por defecto
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "15000"]
