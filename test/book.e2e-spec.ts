import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from '../src/config/typeorm.config';

describe('BookController (e2e)', () => {
  let app: INestApplication;
  let createdBookId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `configurations/.env.test`,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: getTypeOrmConfig,
          inject: [ConfigService],
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/books (POST)', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send({
        name: 'Test Book',
        author: 'Test Author',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('Test Book');
        expect(res.body.author).toBe('Test Author');
        createdBookId = res.body.id;
      });
  });

  it('/books (GET)', () => {
    return request(app.getHttpServer())
      .get('/books')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('/books/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/books/${createdBookId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(createdBookId);
        expect(res.body.name).toBe('Test Book');
        expect(res.body.author).toBe('Test Author');
      });
  });

  it('/books/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/books/${createdBookId}`)
      .send({
        name: 'Updated Test Book',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(createdBookId);
        expect(res.body.name).toBe('Updated Test Book');
        expect(res.body.author).toBe('Test Author');
      });
  });

  it('/books/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/books/${createdBookId}`)
      .expect(204);
  });

  it('/books/:id (GET) - Should return 404 for deleted book', () => {
    return request(app.getHttpServer())
      .get(`/books/${createdBookId}`)
      .expect(404);
  });
});
