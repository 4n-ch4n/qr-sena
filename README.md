# QR Pet Tag System

This is the backend system for INU-QR, a platform that provides smart QR tags for pets. When a lost pet's tag is scanned, the owner is notified, and the finder can see the pet's information to help return it home safely.

## ✨ Features

*   **User Authentication**: Secure user registration and login using JWT.
*   **Pet Management**: Users can create and manage profiles for their pets, including details like name, breed, age, and a photo.
*   **Smart QR Codes**: Each pet is assigned a unique QR code. The system manages the creation and association of these codes.
*   **Lost Pet Reports**: If a pet is lost, the owner can activate a "lost mode". Anyone who scans the QR code will be shown a page with contact information and a message from the owner.
*   **Purchase System**: Users can purchase the physical QR tags through the platform.
*   **Payment Integration**: Integrated with MercadoPago to process payments securely.
*   **File Uploads**: Supports uploading pet images to a cloud storage service.
*   **PDF Generation**: Generates reports, such as purchase receipts.
*   **Admin Panel**: Basic administrative functions to manage the platform.

## 🚀 Technologies Used

*   **Backend**: [NestJS](https://nestjs.com/)
*   **ORM**: [Prisma](https://www.prisma.io/)
*   **Database**: [PostgreSQL](https://www.postgresql.org/)
*   **Authentication**: [Passport.js](http://www.passportjs.org/) with JWT strategy
*   **Containerization**: [Docker](https://www.docker.com/)
*   **Payment Gateway**: [MercadoPago SDK](https://www.mercadopago.com/developers/es/docs)

## 📋 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v20 or higher)
*   [Docker](https://www.docker.com/get-started) and Docker Compose

### Installation & Setup

1.  **Clone the repository:**

2.  **Create the environment file:**
    Duplicate the `.env.example` file (if it exists) or create a new file named `.env` and fill it with the necessary environment variables.

    ```env
    # Application
    PORT=3000
    HOST_API=http://localhost:3000
    STAGE=dev

    # Database (Docker)
    DB_USERNAME=postgres
    DB_PASSWORD=postgres
    DB_NAME=inu-qr
    DB_HOST=db
    DB_PORT=5432
    DATABASE_URL="postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

    # JWT
    JWT_SECRET=YourSuperSecretKey

    # MercadoPago
    PROD_ACCESS_TOKEN=
    DEV_ACCESS_TOKEN=
    WEBHOOK_SECRET=

    # DigitalOcean Spaces (or other S3-compatible storage)
    DO_SPACES_URL=
    DO_SPACES_CDN_URL=
    DO_SPACES_BUCKET=
    DO_SPACES_ACCESS_KEY=
    DO_SPACE_SECRET_KEY=
    DO_SPACE_REGION=
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Application with Docker

This is the recommended way to run the application for development.

1.  **Build and run the containers:**
    This command will start the NestJS application and a PostgreSQL database in Docker containers.
    ```bash
    docker-compose up --build
    ```
    The `docker-compose.yml` is configured to automatically run database migrations (`npx prisma migrate dev`) and start the app in watch mode.

2.  The application will be available at `http://localhost:3000`.

## 📁 Project Structure

The project follows the standard NestJS modular structure.

```
src/
├── admin/         # Admin-specific functionalities
├── auth/          # Authentication, user management, JWT strategy
├── common/        # Shared modules and DTOs
├── files/         # File upload handling
├── lost-pet-report/ # Logic for lost pet reports
├── mailer/        # Email sending service
├── pets/          # Pet profile management
├── printer/       # PDF generation services
├── purchase/      # Purchase and order logic
├── qr/            # QR code generation
├── reports/       # PDF report templates and generation
├── webhooks/      # Webhook handling (e.g., for MercadoPago)
├── app.module.ts  # Root module
├── main.ts        # Application entry point
└── prisma.service.ts # Prisma client service
```

## 🗃️ Database Schema

The database schema is defined in `prisma/schema.prisma`. The main models are:

*   `User`: Stores user information.
*   `Pet`: Contains details about each pet.
*   `PetCode`: Manages the unique QR codes.
*   `LostPetReport`: Stores information for active lost pet alerts.
*   `Purchase`: Tracks user purchases.
*   `PurchaseItem`: Details of items within a purchase.
*   `ShippingInfo`: Shipping details for an order.

