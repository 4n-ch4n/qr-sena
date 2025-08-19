# Guía de Instalación y Configuración - QR-SENA

## Requisitos Previos

### Hardware Mínimo
- **Procesador**: Intel i5 o AMD Ryzen 5 (o equivalente)
- **Memoria RAM**: 8 GB (recomendado 16 GB)
- **Almacenamiento**: 10 GB de espacio libre
- **Conectividad**: Conexión estable a internet

### Software Requerido
- **Node.js**: Versión 18.x LTS o superior
- **npm**: Versión 8.x o superior
- **Git**: Versión 2.28 o superior
- **Docker**: Versión 20.10 o superior
- **Docker Compose**: Versión 2.0 o superior

## Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone https://github.com/4n-ch4n/qr-sena.git
cd qr-sena
```

### 2. Instalar Dependencias

```bash
# Usando npm
npm install

# O usando yarn
yarn install
```

### 3. Configuración de Variables de Entorno

Copiar el archivo de plantilla y configurar las variables:

```bash
cp .env.template .env
```

Editar el archivo `.env` con los siguientes valores:

```env
# Base de datos
DB_PASSWORD=MySecr3tPassWord@as2
DB_NAME=QR_inu
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres

# API Configuration
PORT=3000
HOST_API=http://localhost:3000/api
FRONT_URL=http://localhost:5173/mascota

# Seguridad
JWT_SECRET=Est3EsMiSE33dSec3t000123

# URL de base de datos
DATABASE_URL="postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

# Frontend URL
FRONTEND_URL=http://localhost:4200

# Servicios externos (opcional para desarrollo)
DO_SPACE_REGION=nyc3
DO_SPACES_CDN_URL=https://cdn.example.com
DO_SPACES_URL=https://nyc3.digitaloceanspaces.com
DO_SPACES_BUCKET=bucket-name
DO_SPACES_ACCESS_KEY=your_access_key
DO_SPACE_SECRET_KEY=your_secret_key

# MercadoPago (opcional para desarrollo)
PROD_ACCESS_TOKEN=your_prod_token
DEV_ACCESS_TOKEN=your_test_token
```

### 4. Configuración de Base de Datos

#### Opción A: Usando Docker (Recomendado)

```bash
# Levantar servicios
docker-compose up -d

# Verificar que los contenedores estén corriendo
docker-compose ps
```

#### Opción B: PostgreSQL Local

Si prefieres instalar PostgreSQL localmente:

1. Instalar PostgreSQL 15.3 o superior
2. Crear base de datos:
```sql
CREATE DATABASE QR_inu;
CREATE USER postgres WITH PASSWORD 'MySecr3tPassWord@as2';
GRANT ALL PRIVILEGES ON DATABASE QR_inu TO postgres;
```

### 5. Migraciones de Base de Datos

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Poblar con datos de prueba
npx prisma db seed
```

### 6. Iniciar el Servidor

```bash
# Modo desarrollo (con hot-reload)
npm run start:dev

# O usando yarn
yarn start:dev
```

El servidor estará disponible en: `http://localhost:3000/api`

## Verificación de la Instalación

### 1. Verificar API

```bash
curl http://localhost:3000/api
```

Debe retornar un mensaje indicando que la API está funcionando.

### 2. Verificar Base de Datos

```bash
# Abrir Prisma Studio
npx prisma studio
```

Se abrirá una interfaz web en `http://localhost:5555` para inspeccionar la base de datos.

### 3. Verificar Endpoints

```bash
# Registrar un usuario de prueba
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "3001234567"
  }'
```

## Scripts Disponibles

```bash
# Desarrollo
npm run start:dev         # Servidor con hot-reload
npm run start:debug       # Servidor en modo debug

# Producción
npm run build             # Compilar aplicación
npm run start:prod        # Ejecutar en producción

# Base de datos
npx prisma migrate dev    # Ejecutar migraciones
npx prisma generate       # Generar cliente Prisma
npx prisma studio         # Interfaz gráfica de BD
npx prisma migrate reset  # Resetear base de datos

# Calidad de código
npm run lint              # Ejecutar ESLint
npm run format            # Formatear código
npm run test              # Pruebas unitarias
npm run test:e2e          # Pruebas end-to-end
npm run test:cov          # Pruebas con cobertura
```

## Configuración de Servicios Externos

### DigitalOcean Spaces (Para imágenes)

1. Crear cuenta en DigitalOcean
2. Crear un Space
3. Obtener las credenciales de acceso
4. Configurar variables en `.env`:

```env
DO_SPACE_REGION=nyc3
DO_SPACES_CDN_URL=https://your-space-name.nyc3.cdn.digitaloceanspaces.com
DO_SPACES_URL=https://nyc3.digitaloceanspaces.com
DO_SPACES_BUCKET=your-space-name
DO_SPACES_ACCESS_KEY=your_access_key
DO_SPACE_SECRET_KEY=your_secret_key
```

### MercadoPago (Para pagos)

1. Crear cuenta de desarrollador en MercadoPago
2. Obtener tokens de prueba y producción
3. Configurar variables en `.env`:

```env
DEV_ACCESS_TOKEN=TEST-your-test-token
PROD_ACCESS_TOKEN=APP_USR-your-prod-token
```

### Servidor SMTP (Para emails)

Configurar un servicio SMTP como SendGrid, Mailgun o Gmail:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Resolución de Problemas Comunes

### Error: "nest: command not found"

```bash
# Instalar NestJS CLI globalmente
npm install -g @nestjs/cli

# O usar npx
npx @nestjs/cli start
```

### Error de conexión a base de datos

1. Verificar que PostgreSQL esté corriendo:
```bash
docker-compose ps
```

2. Verificar variables de entorno en `.env`
3. Reiniciar contenedores:
```bash
docker-compose down
docker-compose up -d
```

### Error de permisos en Docker

```bash
# En Linux/macOS
sudo docker-compose up -d

# O agregar usuario al grupo docker
sudo usermod -aG docker $USER
```

### Error de migraciones Prisma

```bash
# Resetear y volver a migrar
npx prisma migrate reset
npx prisma migrate dev
```

### Puerto 3000 en uso

```bash
# Cambiar puerto en .env
PORT=3001

# O encontrar y matar proceso
lsof -ti:3000 | xargs kill
```

## Configuración para Producción

### Variables de Entorno de Producción

```env
# Modo
NODE_ENV=production
STAGE=prod

# Base de datos (usar servicio administrado)
DATABASE_URL="postgresql://user:password@prod-db-host:5432/dbname"

# URLs de producción
HOST_API=https://api.your-domain.com
FRONT_URL=https://your-domain.com/mascota
FRONTEND_URL=https://your-domain.com

# Tokens reales
PROD_ACCESS_TOKEN=your_real_mercadopago_token
```

### Dockerfile para Producción

```bash
# Construir imagen
docker build -t qr-sena:prod --target prod .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env.prod qr-sena:prod
```

### Docker Compose para Producción

```bash
STAGE=prod docker-compose -f docker-compose.prod.yml up -d
```

## Monitoreo y Logs

### Ver logs de la aplicación

```bash
# Docker
docker-compose logs -f app

# Logs en tiempo real
npm run start:dev
```

### Monitorear base de datos

```bash
# Conectar a PostgreSQL
docker exec -it qr_inu psql -U postgres -d QR_inu

# Ver tablas
\dt

# Ver datos de una tabla
SELECT * FROM "User" LIMIT 5;
```

## Respaldo y Restauración

### Backup de base de datos

```bash
# Crear backup
docker exec qr_inu pg_dump -U postgres QR_inu > backup.sql

# Restaurar backup
docker exec -i qr_inu psql -U postgres QR_inu < backup.sql
```

### Backup de archivos

```bash
# Backup de la carpeta de uploads (si se almacena localmente)
tar -czf uploads_backup.tar.gz uploads/
```