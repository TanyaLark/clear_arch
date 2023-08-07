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

currentTest = 'GET article/user/:userId';

test(`${currentTest} should return welcome article for user after registration`, async (t) => {
  const email = faker.internet.email();
  const password = faker.internet.password();
  const response = await request(app.getHttpServer())
    .post('/user/register')
    .send({ email, password });
  const userId = response.body.id;

  const articleResponse = await request(app.getHttpServer()).get(
    '/article/user/' + userId,
  );

  const responseObject = JSON.parse(articleResponse.text);
  t.is(articleResponse.status, 200);
  t.is(responseObject[0].title, 'Welcome to my blog!');
  t.is(responseObject[0].body, 'This is your first article!');
  t.is(responseObject[0].author.id, userId);
  t.is(responseObject[0].author.email, email);
  t.is(responseObject[0].author.password, undefined);
  t.pass();
});

currentTest = 'POST /article/create';

test(`${currentTest} should create new article and return info`, async (t) => {
  const email = faker.internet.email();
  const password = faker.internet.password();
  const response = await request(app.getHttpServer())
    .post('/user/register')
    .send({ email, password });
  const userId = response.body.id;

  const articleTitle = faker.lorem.words(3);
  const articleBody = faker.lorem.words(10);
  const articleResponse = await request(app.getHttpServer())
    .post('/article/create/' + userId)
    .send({ title: articleTitle, body: articleBody });

  const responseObject = JSON.parse(articleResponse.text);
  t.is(articleResponse.status, 201);
  t.is(responseObject.title, articleTitle);
  t.is(responseObject.body, articleBody);
  t.is(responseObject.author.id, userId);
  t.is(responseObject.author.email, email);
  t.is(responseObject.author.password, undefined);
  t.pass();
});

currentTest = 'DELETE /article/:userId';

test(`${currentTest} should delete all articles for user`, async (t) => {
  const email = faker.internet.email();
  const password = faker.internet.password();
  const response = await request(app.getHttpServer())
    .post('/user/register')
    .send({ email, password });
  const userId = response.body.id;

  const articlesCount = 5;
  for (let i = 0; i < articlesCount; i++) {
    const articleTitle = faker.lorem.words(3);
    const articleBody = faker.lorem.words(10);
    await request(app.getHttpServer())
      .post('/article/create/' + userId)
      .send({ title: articleTitle, body: articleBody });
  }
  // Check that articles were created
  const articleResponse = await request(app.getHttpServer()).get(
    '/article/user/' + userId,
  );
  const responseObject = JSON.parse(articleResponse.text);
  t.is(articleResponse.status, 200);
  t.is(responseObject.length, articlesCount + 1);

  // Delete articles. Delete result returned. Article authors without password returned.
  const deleteResponse = await request(app.getHttpServer()).delete(
    '/article/' + userId,
  );
  t.is(deleteResponse.status, 200);
  const deleteResponseObject = JSON.parse(deleteResponse.text);
  t.is(deleteResponseObject.length, articlesCount + 1);
  t.is(deleteResponseObject[0].author.password, undefined);

  // Check that articles were deleted.
  const articleResponseAfterDelete = await request(app.getHttpServer()).get(
    '/article/user/' + userId,
  );
  const responseObjectAfterDelete = JSON.parse(articleResponseAfterDelete.text);
  t.is(articleResponseAfterDelete.status, 200);
  t.is(responseObjectAfterDelete.length, 0);
  t.pass();
});

currentTest = 'GET /article/all';
test(`${currentTest} should return all articles for all users info`, async (t) => {
  const usersCount = 5;
  const articlesPerUserCount = 5;

  for (let i = 0; i < usersCount; i++) {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const response = await request(app.getHttpServer())
      .post('/user/register')
      .send({ email, password });
    const userId = response.body.id;
    for (let j = 0; j < articlesPerUserCount; j++) {
      const articleTitle = faker.lorem.words(3);
      const articleBody = faker.lorem.words(10);
      await request(app.getHttpServer())
        .post('/article/create/' + userId)
        .send({ title: articleTitle, body: articleBody });
    }
  }

  const articleResponse = await request(app.getHttpServer()).get(
    '/article/all',
  );
  const responseObject = JSON.parse(articleResponse.text);
  t.is(articleResponse.status, 200);
  t.is(responseObject.length, usersCount * articlesPerUserCount + usersCount);
  t.pass();
});
