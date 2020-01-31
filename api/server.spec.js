const request = require('supertest');
const server = require('./server');
const db = require('../database/dbConfig.js');

let token;

const user = {
    username: "jacob washburn",
    password: "password"
};

describe('server', () => {

    describe('test env', () => {
        it('', () => {
            expect(process.env.DB_ENV).toBe('testing');
        });
    });
    it('runs the server', () => {
        expect(true).toBe(true);
    });
    describe('get /', () => {
        it('should return 200 ok', () => {
            return request(server)
                .get('/')
                .then(res => {
                    expect(res.status).toBe(200);
                });
        });
        it('should return api: Api is running', () => {
            return request(server)
                .get('/')
                .then(res => {
                    expect(res.body.api).toBe('Api running');
                });
        });
        it('content type should be json', () => {
            return request(server)
                .get('/')
                .then(res => {
                    expect(res.type).toBe('application/json');
                });
        });
    });
});

describe('register', () => {
    beforeEach(async () => {
        await db('users').truncate();
    });
    it('should return status 201', () => {
        return request(server)
            .post('/api/auth/register')
            .send(user)
            .then(res => {
                expect(res.status).toBe(201);
                expect(res.body.username).toBe('jacob washburn');
            });
    });
    it('password has been changed/hashed', () => {
        return request(server)
            .post('/api/auth/register')
            .send(user)
            .then(res => {
                expect(res.body.password.length).toBeGreaterThan('password'.length);
            });
    });
});

describe('login', () => {
    it('should return message: Welcome jacob washburn', () => {
        return request(server)
            .post('/api/auth/login')
            .send(user)
            .then(res => {
                expect(res.body.message).toBe(`Welcome ${user.username}!`);
            });
    });
    it('status should be 200', () => {
        return request(server)
            .post('/api/auth/login')
            .send(user)
            .then(res => {
                expect(res.status).toBe(200);
            });
    });
    it('should get a token', () => {
        return request(server)
            .post('/api/auth/login')
            .send(user)
            .then(res => {
                expect(res.body.token).toBeDefined();
                token = res.body.token;
            });

    });
});

describe('users', () => {

    it('get all users length should be 1', () => {
        return request(server)
            .get('/api/users')
            .set('Authorization', token)
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body.users).toBeDefined();
                expect(res.body.users.length).toBe(1);
            });
    });
    it('first username should === user.username', () => {
        return request(server)
            .get('/api/users')
            .set('Authorization', token)
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body.users).toBeDefined();
                expect(res.body.users[0].username).toBeDefined();
                expect(res.body.users[0].username).toBe(user.username);
            });
    });
    // it('')

});

