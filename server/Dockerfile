# Stage 1: Build
# Usa una imagen de Node.js compatible con ARM para la etapa de construcción
FROM node:20 AS build

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia package.json e instala las dependencias
COPY package*.json ./
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Construye la aplicación (si es necesario, por ejemplo, con TypeScript)
# RUN npm run build

# Stage 2: Runtime
# Usa una imagen de Node.js compatible con ARM para la etapa de runtime
FROM node:20-slim

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia la salida de la construcción desde la etapa anterior (si hay alguna)
# COPY --from=build /app/build ./build

# Copia el código fuente de la aplicación
COPY --from=build /usr/src/app .

# Instala dependencias de producción
RUN npm install --only=production

# Exponer el puerto en el que se ejecuta la aplicación
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["npm", "start"]
