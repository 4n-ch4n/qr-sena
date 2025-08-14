# Documentación Técnica QR-SENA

Esta carpeta contiene la documentación técnica completa del sistema QR-SENA.

## Contenido

### 📋 [Manual Técnico Completo](MANUAL_TECNICO.md)
Documento principal que incluye:
- Presentación y objetivos del sistema
- Arquitectura técnica detallada
- Herramientas y tecnologías utilizadas
- Diagramas de modelamiento (clases, casos de uso)
- Diccionario de datos completo
- Configuración del entorno de desarrollo
- Requerimientos del software
- Bibliografía y referencias

### 🏗️ [Diagramas de Arquitectura](architecture-diagrams.md)
- Diagramas de arquitectura general del sistema
- Estructura de módulos de NestJS
- Flujos de datos principales
- Diagramas de secuencia para procesos críticos

### 🔗 [Documentación de API](api-endpoints.md)
- Lista completa de endpoints
- Ejemplos de request/response
- Códigos de estado HTTP
- Documentación de errores
- Ejemplos de uso con curl

### ⚙️ [Guía de Instalación](installation-guide.md)
- Requisitos previos del sistema
- Instalación paso a paso
- Configuración de variables de entorno
- Configuración de servicios externos
- Resolución de problemas comunes
- Configuración para producción

## Estructura del Sistema

```
QR-SENA/
├── src/
│   ├── auth/           # Autenticación y autorización
│   ├── pets/           # Gestión de mascotas
│   ├── qr/             # Generación de códigos QR
│   ├── purchase/       # Procesamiento de compras
│   ├── admin/          # Funciones administrativas
│   ├── files/          # Gestión de archivos
│   ├── mailer/         # Sistema de notificaciones
│   ├── printer/        # Generación de PDFs
│   ├── webhooks/       # Integración con servicios externos
│   └── reports/        # Plantillas de reportes
├── prisma/             # Esquema de base de datos
├── docker-compose.yml  # Configuración de Docker
└── docs/               # Documentación técnica
```

## Tecnologías Principales

- **Backend**: NestJS + TypeScript
- **Base de datos**: PostgreSQL + Prisma ORM
- **Autenticación**: JWT (JSON Web Tokens)
- **Contenedorización**: Docker + Docker Compose
- **Generación QR**: qrcode library
- **PDFs**: PDFMake
- **Pagos**: MercadoPago API
- **Almacenamiento**: DigitalOcean Spaces
- **Emails**: Nodemailer

## Inicio Rápido

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/4n-ch4n/qr-sena.git
   cd qr-sena
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   ```bash
   cp .env.template .env
   # Editar .env con tus configuraciones
   ```

4. **Levantar base de datos**:
   ```bash
   docker-compose up -d
   ```

5. **Ejecutar migraciones**:
   ```bash
   npx prisma migrate dev
   ```

6. **Iniciar servidor**:
   ```bash
   npm run start:dev
   ```

La API estará disponible en: `http://localhost:3000/api`

## Contribución

Para contribuir al proyecto:

1. Lee el [Manual Técnico](MANUAL_TECNICO.md) completo
2. Revisa la [Guía de Instalación](installation-guide.md)
3. Consulta la [documentación de API](api-endpoints.md)
4. Sigue las convenciones de código establecidas

## Soporte

Para soporte técnico o preguntas sobre la implementación, consulta:
- [Manual Técnico](MANUAL_TECNICO.md) - Sección de resolución de problemas
- [Guía de Instalación](installation-guide.md) - Problemas comunes
- Issues del repositorio en GitHub

---

**Versión**: 1.0  
**Última actualización**: Agosto 2024  
**Mantenido por**: Equipo de desarrollo QR-SENA