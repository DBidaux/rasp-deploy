# Nombre de usuario de Docker Hub
DOCKERHUB_USER=dbidaux

# Nombre de las imágenes
CLIENT_IMAGE=proyectohorizon27_client
SERVER_IMAGE=proyectohorizon27_server

.PHONY: all client server clean push deploy dev

# Construir todas las imágenes
all: client server

# Construir la imagen del cliente
client:
	@echo "Building client..."
	docker build -t $(DOCKERHUB_USER)/$(CLIENT_IMAGE):latest ./client

# Construir la imagen del servidor
server:
	@echo "Building server..."
	docker build -t $(DOCKERHUB_USER)/$(SERVER_IMAGE):latest ./server

# Subir las imágenes a Docker Hub
push: all
	@echo "Pushing client image..."
	docker push $(DOCKERHUB_USER)/$(CLIENT_IMAGE):latest
	@echo "Pushing server image..."
	docker push $(DOCKERHUB_USER)/$(SERVER_IMAGE):latest

# Desplegar en el servidor
deploy: push
	@echo "Deploying to server..."
	@ssh debian@51.254.96.88 -p 49913 "/home/debian/update_and_restart.sh"

# Levantar contenedores para desarrollo
dev: all
	docker-compose up

# Limpiar las imágenes locales
clean:
	@echo "Cleaning up..."
	docker rmi $(DOCKERHUB_USER)/$(CLIENT_IMAGE):latest
	docker rmi $(DOCKERHUB_USER)/$(SERVER_IMAGE):latest
