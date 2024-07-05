# sintaxis a usar
# syntax=docker/dockerfile:1

#usa imagen de node mas liviana 1era etapa
FROM node:current-alpine as build

# directorio de trabajo, comandos se ejecutan ahi
WORKDIR /usr/src/app

# copia pack json e instala las dependencias
COPY package.json package-lock.json ./
RUN npm install

# copia archivos a workdir y construye la aplicación (react-scripts)
COPY . .
RUN npm run build

# reducir tamaño final sin deps temporales 2nda etapa
FROM node:current-alpine

# directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de construcción desde la etapa de build
COPY --from=build /usr/src/app/build ./build

# Instala 'serve' para servir la aplicación (estático)
RUN npm install -g serve

# Expone el puerto y establece el comando por defecto
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
