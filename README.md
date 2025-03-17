Products API

Este proyecto es una API REST construida con Node, NestJS, TypeORM y PostgreSQL. La API permite gestionar productos y está integrada con la FakeStore API para obtener información de productos externos.

🚀 Requisitos previos

Node.js (versión 18 o superior)
PostgreSQL

📦 Instalación

Clona el repositorio  
https://github.com/Seba-Rigeiro/products-api.git

accede a la carpeta del proyecto:
cd products-api

Instala las dependencias:

yarn

⚙️ Configuración del entorno

Crea un archivo .env en la raíz del proyecto a partir del .env.example y agrega las siguientes variables de entorno:

PORT=
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=

🚀 Ejecución del proyecto

Ejecuta el servidor en modo desarrollo con:

yarn start:dev

La API estará disponible en http://localhost:3000.

🧪 Pruebas

Ejecuta las pruebas unitarias con:

yarn test

📖 Documentación con Swagger

Después de iniciar el servidor, accede a la documentación en:

http://localhost:3000/api/docs

📌 Endpoints principales

GET /products - Listar todos los productos

GET /products/:id - Obtener un producto por ID

POST /products - Crear un nuevo producto

PUT /products/:id/stock - Actualizar el stock de un producto

DELETE /products/:id - Eliminar un producto
