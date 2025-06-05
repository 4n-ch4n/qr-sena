<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## QR CODES

API para registro de mascotas y generación de códigos QR, construida con [NestJS](https://nestjs.com/) y [Prisma](https://www.prisma.io/).

## Requisitos

- Tener [yarn](https://yarnpkg.com/) o [npm] instalado
- Tener [docker](https://www.docker.com/) instalado

## Instalación

1. Instala las dependencias:
   ```bash
   yarn install
   ##o
   npm install
   ```

2. Crea el archivo `.env` basado en `.env.template` y ajusta los valores según tu entorno.

3. Levanta la base de datos con Docker:
   ```bash
   docker compose up -d
   ```

4. Ejecuta las migraciones de Prisma:
   ```bash
   npx prisma migrate dev
   ```

5. Inicia el servidor de desarrollo:
   ```bash
   yarn start:dev
   ##o
   npm run start:dev
   ```

## Uso

- El servidor corre por defecto en [http://localhost:3000/api](http://localhost:3000/api)
