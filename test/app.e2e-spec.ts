import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import {
    deletePhoto,
    newPhoto,
    testComment,
    testPackageCreate,
    testPackageNewName,
    testSurfcampLogin,
    testSurfcampNewName,
    testSurfcampRegister,
    testUserLogin,
    testUserNewName,
    testUserRegister,
} from './mocks/surfcamp.mocks';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    let surfcampId;
    let surfcampToken;
    let surfcampResponseStructure;

    let packageId;
    let packageResponseStructure;
    let packageResponsePopulatedSurfcamp;

    let userId;
    let userToken;
    let userResponseStructure;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await request(app.getHttpServer())
            .delete(`/users/${userId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${userToken}`);

        await request(app.getHttpServer())
            .delete(`/packages/${packageId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${surfcampToken}`);

        await request(app.getHttpServer())
            .delete(`/surfcamps/${surfcampId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${surfcampToken}`);

        await app.close();
    });

    test('POST /auth/surfcamps/register creates a new surfcamp', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/surfcamps/register')
            .set('Accept', 'application/json')
            .send(testSurfcampRegister);
        surfcampId = response.body._id;
        surfcampResponseStructure = response.body;
        expect(response.body.email).toEqual(testSurfcampRegister.email);
        expect(response.body.username).toEqual(testSurfcampRegister.username);
        expect(response.body.name).toEqual(testSurfcampRegister.name);
        expect(response.body.location).toEqual(testSurfcampRegister.location);
        expect(response.body.rating).toEqual(0);
    });
    test('POST /auth/surfcamps/login returns a token', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/surfcamps/login')
            .set('Accept', 'application/json')
            .send(testSurfcampLogin);
        surfcampToken = response.body.token;
        expect(response.body.token).toBeDefined();
    });
    test('GET /surfcamps returns an array with the testSurfcamp', async () => {
        const response = await request(app.getHttpServer())
            .get('/surfcamps')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${surfcampToken}`);

        expect(response.body).toEqual([surfcampResponseStructure]);
    });
    test('GET /surfcamps/:id returns the testSurfcamp', async () => {
        const response = await request(app.getHttpServer())
            .get(`/surfcamps/${surfcampId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${surfcampToken}`);

        expect(response.body).toEqual(surfcampResponseStructure);
    });
    test('PATCH /surfcamps/:id returns the testSurfcamp with changed name', async () => {
        const response = await request(app.getHttpServer())
            .patch(`/surfcamps/${surfcampId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${surfcampToken}`)
            .send(testSurfcampNewName);
        surfcampResponseStructure = {
            ...surfcampResponseStructure,
            name: testSurfcampNewName.name,
        };
        expect(response.body).toEqual(surfcampResponseStructure);
    });
    test('POST /surfcamps/:id/photos returns the testSurfcamp with the photo added in photos array', async () => {
        const response = await request(app.getHttpServer())
            .post(`/surfcamps/${surfcampId}/photos`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${surfcampToken}`)
            .send(newPhoto);
        expect(response.body).toEqual({
            ...surfcampResponseStructure,
            photos: [newPhoto.photoUrl],
        });
    });
    test('PATCH /surfcamps/:id/photos returns the testSurfcamp with the photo removed in photos array', async () => {
        const response = await request(app.getHttpServer())
            .patch(`/surfcamps/${surfcampId}/photos`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${surfcampToken}`)
            .send(deletePhoto);
        expect(response.body).toEqual(surfcampResponseStructure);
    });
    test('POST /packages creates a new package for the surfcamp', async () => {
        const response = await request(app.getHttpServer())
            .post(`/packages`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${surfcampToken}`)
            .send(testPackageCreate);
        packageId = response.body._id;
        packageResponseStructure = response.body;
        expect(response.body.name).toEqual(testPackageCreate.name);
        expect(response.body.price).toEqual(testPackageCreate.price);
        expect(response.body.days).toEqual(testPackageCreate.days);
        expect(response.body.description).toEqual(
            testPackageCreate.description
        );
        expect(response.body.icon).toEqual(testPackageCreate.icon);
        expect(response.body.surfcamp).toEqual(surfcampId);
    });
    test('GET /packages returns an array with the test package', async () => {
        const response = await request(app.getHttpServer())
            .get(`/packages`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${surfcampToken}`);
        packageResponsePopulatedSurfcamp = response.body[0];
        expect(response.body[0].name).toEqual(testPackageCreate.name);
        expect(response.body[0].price).toEqual(testPackageCreate.price);
        expect(response.body[0].days).toEqual(testPackageCreate.days);
        expect(response.body[0].description).toEqual(
            testPackageCreate.description
        );
        expect(response.body[0].icon).toEqual(testPackageCreate.icon);
        expect(response.body[0].surfcamp._id).toEqual(surfcampId);
        expect(response.body[0].surfcamp.name).toEqual(
            surfcampResponseStructure.name
        );
    });
    test('GET /packages/:id returns the test package', async () => {
        const response = await request(app.getHttpServer())
            .get(`/packages/${packageId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${surfcampToken}`);
        expect(response.body.name).toEqual(
            packageResponsePopulatedSurfcamp.name
        );
        expect(response.body.price).toEqual(
            packageResponsePopulatedSurfcamp.price
        );
        expect(response.body.days).toEqual(
            packageResponsePopulatedSurfcamp.days
        );
        expect(response.body.description).toEqual(
            packageResponsePopulatedSurfcamp.description
        );
        expect(response.body.icon).toEqual(
            packageResponsePopulatedSurfcamp.icon
        );
        expect(response.body.surfcamp._id).toEqual(
            packageResponsePopulatedSurfcamp.surfcamp._id
        );
        expect(response.body.surfcamp.name).toEqual(
            packageResponsePopulatedSurfcamp.surfcamp.name
        );
    });
    test('PUT /packages/:id returns the package with a changed name', async () => {
        const response = await request(app.getHttpServer())
            .put(`/packages/${packageId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${surfcampToken}`)
            .send(testPackageNewName);
        expect(response.body.name).toEqual(testPackageNewName.name);
    });
    test('POST /auth/users/register returns the new user', async () => {
        const response = await request(app.getHttpServer())
            .post(`/auth/users/register`)
            .set('Accept', 'application/json')
            .send(testUserRegister);
        userId = response.body._id;
        expect(response.body.name).toEqual(testUserRegister.name);
        expect(response.body.email).toEqual(testUserRegister.email);
        expect(response.body.username).toEqual(testUserRegister.username);
        expect(response.body.lastName).toEqual(testUserRegister.lastName);
    });
    test('POST /auth/users/login returns the new user', async () => {
        const response = await request(app.getHttpServer())
            .post(`/auth/users/login`)
            .set('Accept', 'application/json')
            .send(testUserLogin);
        userToken = response.body.token;
        expect(response.body.token).toBeDefined();
    });
    test('GET /auth/login-token returns the token info', async () => {
        const response = await request(app.getHttpServer())
            .get(`/auth/login-token`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${userToken}`);
        expect(response.body.name).toEqual(testUserRegister.name);
        expect(response.body.lastName).toEqual(testUserRegister.lastName);
        expect(response.body.role).toEqual('user');
    });
    test('GET /users/:id returns the token info', async () => {
        const response = await request(app.getHttpServer())
            .get(`/users/${userId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${userToken}`);
        expect(response.body.name).toEqual(testUserRegister.name);
        expect(response.body.lastName).toEqual(testUserRegister.lastName);
    });
    test('PATCH /users/:id returns the token info', async () => {
        const response = await request(app.getHttpServer())
            .patch(`/users/${userId}`)
            .set('Accept', 'application/json')
            .send(testUserNewName)
            .set('Authorization', `Bearer ${userToken}`);
        expect(response.body.name).toEqual(testUserNewName.name);
    });
    test('GET /surfcamps/:id/packages returns the surfcamp packages', async () => {
        const response = await request(app.getHttpServer())
            .get(`/surfcamps/${surfcampId}/packages`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${userToken}`);
        expect(response.body[0].price).toEqual(testPackageCreate.price);
        expect(response.body[0].days).toEqual(testPackageCreate.days);
        expect(response.body[0].description).toEqual(
            testPackageCreate.description
        );
    });
    test('GET /surfcamps/search?location=test&rating=0 returns the surfcamp in an array', async () => {
        const response = await request(app.getHttpServer())
            .get(`/surfcamps/search?location=test&rating=0`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${userToken}`);
        expect(response.body[0].location).toEqual(
            testSurfcampRegister.location
        );
        expect(response.body[0].email).toEqual(testSurfcampRegister.email);
    });
    test('POST /surfcamps/:id/comments returns the surfcamp in an array', async () => {
        const response = await request(app.getHttpServer())
            .post(`/surfcamps/${surfcampId}/comments`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${userToken}`)
            .send(testComment);
        expect(response.body.comments[0]).toBeDefined();
        expect(response.body.comments[0].user).toEqual(userId);
        expect(response.body.comments[0].comment).toEqual(testComment.comment);
        expect(response.body.comments[0].rating).toEqual(testComment.rating);
    });
    test('GET /packages/search?price=1000&days=10 returns the package in an array', async () => {
        const response = await request(app.getHttpServer())
            .get(`/packages/search?price=1000&days=10`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${userToken}`);
        expect(response.body[0].price).toEqual(testPackageCreate.price);
        expect(response.body[0].days).toEqual(testPackageCreate.days);
        expect(response.body[0].description).toEqual(
            testPackageCreate.description
        );
    });
    test('GET /packages/:id/book returns a message that operation was successful, and adds customer in surfcamp and package in bookings on user', async () => {
        const response = await request(app.getHttpServer())
            .get(`/packages/${packageId}/book`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${userToken}`);
        expect(response.body.message).toEqual(
            `User ${userId} successfully booked package ${packageId}`
        );
        const surfcampResponse = await request(app.getHttpServer())
            .get(`/surfcamps/${surfcampId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${userToken}`);
        expect(surfcampResponse.body.customers[0].user).toEqual(userId);
        expect(surfcampResponse.body.customers[0].package).toEqual(packageId);

        const userResponse = await request(app.getHttpServer())
            .get(`/users/${userId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${userToken}`);
        expect(userResponse.body.bookings[0]).toEqual(packageId);
    });
});
