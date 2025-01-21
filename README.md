# Microservice Start

A microservice starter template built with Bun, Elysia, PostgreSQL, and MinIO.

## Prerequisites

- [Bun](https://bun.sh/) installed
- Docker and Docker Compose
- Node.js (for development tools)

## Tech Stack

- **Runtime:** Bun
- **Framework:** Elysia
- **Database:** PostgreSQL
- **Object Storage:** MinIO
- **Authentication:** better-auth
- **Email Templates:** React Email
- **Database Tools:** Drizzle ORM

## Project Setup

1. Clone the repository:

```bash
git clone <your-repository-url>
cd microservice-start
```

2. Set up environment files:

```bash
# Copy environment examples
cp .env.example .env
cp .env.services.example .env.services
```

3. Configure the environment variables:

**.env**

```env
PORT=3000
SERVICE_NAME=<your-service-name>
DATABASE_URL="postgresql://..."
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_ENDPOINT_URL=
MINIO_PORT=
MINIO_BUCKET_NAME=
BETTER_AUTH_SECRET=

# DO NOT CHANGE
BETTER_AUTH_URL=http://127.0.0.1:${PORT}
```

**.env.services**

```env
DB_USER=
DB_PASSWORD=
DB_PORT=

MINIO_ROOT_USER=
MINIO_ROOT_PASSWORD=
```

## Running the Project

1. Start the required services (PostgreSQL, MinIO):

```bash
bun run services:up
```

2. Configure MinIO:

   - Access MinIO console at `http://localhost:9000`
   - Log in using the credentials set in `.env.services`
   - Create an access key and secret key
   - Update the `.env` file with the generated MinIO credentials:
     - `MINIO_ACCESS_KEY`
     - `MINIO_SECRET_KEY`

3. Install dependencies and start the development server:

```bash
bun install
bun dev
```

## Development Tools

### Database Management

- Open Database Studio:

```bash
bun run db:studio
```

- Check database schema:

```bash
bun run db:check
```

- Generate database migrations:

```bash
bun run db:generate
```

- Run migrations:

```bash
bun run db:migrate
```

- Pull database schema:

```bash
bun run db:pull
```

- Push database changes:

```bash
bun run db:push
```

### Other Commands

- Run tests:

```bash
bun test
```

- Format code:

```bash
bun run format
```

- Generate auth configuration:

```bash
bun run auth:generate
```

- Development email server:

```bash
bun run email
```

- Build for production:

```bash
bun run build
```

### Service Management

- Start services:

```bash
bun run services:up
```

- Stop services:

```bash
bun run services:down
```

## Contributing

[Add your contribution guidelines here]

## License

[Add your license information here]
