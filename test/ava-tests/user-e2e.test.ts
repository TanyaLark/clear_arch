import test from 'ava';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { DatabaseModule } from '../../src/shared/database/database.module.js';
import { AppModule } from '../../src/app.module.js';
import { DatabaseService } from '../../src/shared/database/database.service.js';
import { TestUtils } from '../utils/test.utils.js';
import { INestApplication } from '@nestjs/common';

let app: INestApplication;
let currentTest: string;
let testUtils: TestUtils;

test.before(async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule, DatabaseModule],
    providers: [DatabaseService, TestUtils],
  }).compile();
  app = moduleFixture.createNestApplication();
  testUtils = moduleFixture.get<TestUtils>(TestUtils);
  await app.init();
  app.getHttpServer().listen(0);
});

test.beforeEach(async () => {
  await testUtils.resetDb();
});

currentTest = 'POST /user/register';

test(`${currentTest} should register user and return info`, async (t) => {
  const email = faker.internet.email();
  const password = faker.internet.password();
  const response = await request(app.getHttpServer())
    .post('/user/register')
    .send({ email, password });
  t.is(response.status, 201);
  t.is(response.body.email, email);
  t.is(response.body.password, undefined);
});

currentTest = 'GET /user/email/:email';
test(`${currentTest} should return user info`, async (t) => {
  const email = faker.internet.email();
  const password = faker.internet.password();
  await request(app.getHttpServer())
    .post('/user/register')
    .send({ email, password });
  const response = await request(app.getHttpServer()).get(
    `/user/email/${email}`,
  );
  t.is(response.status, 200);
  t.is(response.body.email, email);
  t.is(response.body.password, undefined);
});

currentTest = 'GET /user/all';
test(`${currentTest} should return all users info`, async (t) => {
  const testUsersCount = 5;
  const testUsers = [];
  for (let i = 0; i < testUsersCount; i++) {
    const email = faker.internet.email();
    const password = faker.internet.password();
    await request(app.getHttpServer())
      .post('/user/register')
      .send({ email, password });
    testUsers.push({ email, password });
  }
  const response = await request(app.getHttpServer()).get('/user/all');
  const responseObject = JSON.parse(response.text);
  t.is(response.status, 200);
  t.is(responseObject.length, testUsersCount);
  responseObject.forEach((user: any) => {
    t.is(user.password, undefined);
    t.true(testUsers.some((testUser) => testUser.email === user.email));
  });
});
