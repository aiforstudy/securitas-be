# NestJS Book API

A RESTful API built with NestJS, TypeORM, and PostgreSQL for managing books.

## Features

- CRUD operations for books
- PostgreSQL database integration
- Environment-based configuration
- TypeORM for database management
- Migration support

## Prerequisites

- Node.js (v16 or later)
- PostgreSQL (v12 or later)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd nestjs-mono
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment files in `configurations` directory:

Create the following files based on your environment:

- `configurations/.env.local` - Local development
- `configurations/.env.development` - Development environment
- `configurations/.env.production` - Production environment

Example environment file structure:

```env
NODE_ENV=local
PORT=3000
API_PREFIX=api

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=your_db_name
DB_SCHEMA=public
```

## Database Setup

1. Create PostgreSQL database:

```sql
CREATE DATABASE your_db_name;
```

2. Run database migrations:

```bash
npm run migration:run
```

## Running the Application

### Development

```bash
# Local development
npm run start:local

# Development environment
npm run start:dev

# Production environment
npm run start:prod
```

## API Endpoints

### Books

- `GET /books` - Get all books
- `GET /books/:id` - Get a specific book
- `POST /books` - Create a new book
- `PATCH /books/:id` - Update a book
- `DELETE /books/:id` - Delete a book

### Request/Response Examples

#### Create Book

```bash
POST /books
Content-Type: application/json

{
  "name": "The Great Gatsby",
  "author": "F. Scott Fitzgerald"
}
```

## Database Migrations

### Generating Migrations

1. First, make changes to your entity files (e.g., `src/modules/book/entities/book.entity.ts`)

2. Generate a new migration:

```bash
# Format
npm run typeorm -- migration:generate -d src/config/typeorm-migrations.config.ts src/migrations/[MigrationName]

# Example for creating books table
npm run typeorm -- migration:generate -d src/config/typeorm-migrations.config.ts src/migrations/CreateBooksTable
```

The generated migration file will be created in `src/migrations/` with a timestamp prefix.

### Managing Migrations

```bash
# Run pending migrations
npm run typeorm -- migration:run -d src/config/typeorm-migrations.config.ts

# Revert last migration
npm run typeorm -- migration:revert -d src/config/typeorm-migrations.config.ts
```

### Migration Example

A typical migration file looks like this:

```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBooksTable1709XXXXXX implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'books',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'author',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('books');
  }
}
```

### Important Notes

- Always run migrations in order: local → development → production
- Back up your database before running migrations in production
- Test migrations in local/development environments first
- Never modify an existing migration file that has been committed to version control
- Create a new migration to modify existing database structures
- Use meaningful names for your migration files

## Project Structure

```
nestjs-mono/
├── configurations/          # Environment configuration files
├── src/
│   ├── config/             # Application configuration
│   │   └── book/          # Book module (controllers, services, entities)
│   ├── migrations/        # Database migrations
│   └── main.ts           # Application entry point
├── test/                  # Test files
└── package.json
```

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Environment Configuration

The application uses different environment configurations based on `NODE_ENV`:

- `local` - Local development
- `development` - Development environment
- `production` - Production environment

Each environment has its own configuration file in the `configurations` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the UNLICENSED License.
