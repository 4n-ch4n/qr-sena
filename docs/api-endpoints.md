# API Endpoints Documentation

## Índice de Endpoints

### Autenticación
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión
- `GET /auth/check-status` - Verificar estado de autenticación
- `PATCH /auth/profile` - Actualizar perfil
- `POST /auth/reset-password` - Restablecer contraseña

### Mascotas
- `GET /pets` - Listar mascotas del usuario
- `POST /pets` - Registrar nueva mascota
- `GET /pets/:id` - Obtener mascota por ID
- `PATCH /pets/:id` - Actualizar mascota
- `DELETE /pets/:id` - Eliminar mascota
- `GET /pets/pet-code/:code` - Consultar código QR

### Compras
- `GET /purchase` - Listar compras del usuario
- `POST /purchase` - Crear nueva compra
- `GET /purchase/:id` - Obtener compra por ID
- `PATCH /purchase/:id/shipping` - Actualizar información de envío
- `GET /purchase/:id/pdf` - Generar PDF de compra

### Administración
- `GET /admin/users` - Listar usuarios (Admin)
- `GET /admin/pets` - Listar todas las mascotas (Admin)
- `GET /admin/purchases` - Listar todas las compras (Admin)
- `POST /admin/pet-codes/generate` - Generar códigos QR (Admin)

### Archivos
- `POST /files/upload` - Subir imagen
- `DELETE /files/:filename` - Eliminar archivo

### Reportes de Mascotas Perdidas
- `GET /lost-pet-report` - Listar reportes
- `POST /lost-pet-report` - Crear reporte
- `PATCH /lost-pet-report/:id` - Actualizar reporte

### Webhooks
- `POST /webhooks/mercadopago` - Webhook de MercadoPago

## Detalles de Endpoints

### POST /auth/register
Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "name": "Juan",
  "last_name": "Pérez", 
  "email": "juan@example.com",
  "password": "password123",
  "phone": "3001234567"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "phone": "3001234567",
    "is_active": true,
    "roles": ["user"]
  },
  "token": "jwt_token_here"
}
```

### POST /auth/login
Autentica un usuario existente.

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "Juan",
    "email": "juan@example.com"
  },
  "token": "jwt_token_here"
}
```

### POST /pets
Registra una nueva mascota.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "name": "Bobby",
  "age": 3,
  "species": "Perro",
  "breed": "Labrador",
  "gender": "Macho",
  "size": "Grande",
  "image": "url_to_image",
  "petCode": "unique_code_123"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "Bobby",
  "age": 3,
  "species": "Perro",
  "breed": "Labrador",
  "gender": "Macho",
  "size": "Grande",
  "image": "url_to_image",
  "qrCode": "data:image/png;base64,qr_code_data",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### GET /pets/pet-code/:code
Consulta información de una mascota por su código QR.

**Response (200):**
```json
{
  "pet": {
    "id": "uuid",
    "name": "Bobby",
    "age": 3,
    "species": "Perro",
    "breed": "Labrador",
    "image": "url_to_image"
  },
  "owner": {
    "name": "Juan",
    "phone": "3001234567",
    "email": "juan@example.com"
  },
  "isLost": false
}
```

### POST /purchase
Crea una nueva compra.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "items": [
    {
      "type": "MEDIUM",
      "name_to_engrave": "Bobby - 3001234567"
    }
  ],
  "shippingInfo": {
    "full_name": "Juan Pérez",
    "phone": "3001234567",
    "address": "Calle 123 #45-67",
    "city": "Bogotá",
    "state": "Cundinamarca",
    "postal_code": "110111"
  }
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "total_price": 50000,
  "status": "PENDING",
  "payment_url": "https://mercadopago.com/payment/...",
  "items": [
    {
      "type": "MEDIUM",
      "unit_price": 30000,
      "name_to_engrave": "Bobby - 3001234567"
    }
  ]
}
```

### POST /lost-pet-report
Reporta una mascota como perdida.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "pet_id": "uuid",
  "message": "Se perdió cerca del parque",
  "location": "Parque El Virrey, Bogotá"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "pet_id": "uuid",
  "message": "Se perdió cerca del parque",
  "location": "Parque El Virrey, Bogotá",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### POST /files/upload
Sube una imagen al servidor.

**Headers:**
```
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data
```

**Request Body:**
```
FormData con campo 'file' conteniendo la imagen
```

**Response (201):**
```json
{
  "url": "https://cdn.example.com/images/filename.jpg",
  "filename": "filename.jpg",
  "size": 1024000,
  "mimetype": "image/jpeg"
}
```

## Códigos de Estado HTTP

### Éxito
- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente
- `204 No Content` - Operación exitosa sin contenido

### Errores del Cliente
- `400 Bad Request` - Datos inválidos
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - Sin permisos
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto (ej: email ya existe)
- `422 Unprocessable Entity` - Error de validación

### Errores del Servidor
- `500 Internal Server Error` - Error interno del servidor

## Ejemplo de Errores

### Error de Validación (422)
```json
{
  "statusCode": 422,
  "message": [
    "name should not be empty",
    "age must be a positive number"
  ],
  "error": "Unprocessable Entity"
}
```

### Error de Autenticación (401)
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### Error de Recurso No Encontrado (404)
```json
{
  "statusCode": 404,
  "message": "Pet not found",
  "error": "Not Found"
}
```