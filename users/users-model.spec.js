const db = require('../database/dbConfig.js');
const Users = require('./users-model');

describe('users model', () => {

    describe('test env', () => {
        it('', () => {
            expect(process.env.DB_ENV).toBe('testing');
        });
    });
    describe('insert', () => {
        beforeEach(async () => {
            await db('users').truncate();
        });
        it('adds a new user', async () => {
            const newUser = {
                username: 'jacob',
                password: 'aaaa'
            };
            await Users.add(newUser);
            const users = await db('users');
            expect(users).toHaveLength(1);
        });
    });
    describe('delete user', () => {
        beforeEach(async () => {
            await db('users').truncate();
        });
        it('adds a new user then deletes it', async () => {
            const newUser = {
                username: 'jacob',
                password: 'aaaa'
            };
            const user = await Users.add(newUser);
            expect(user.username).toBe('jacob');
            await Users.remove(user.id);
            const users = await db('users');
            expect(users).toHaveLength(0);
        });
    });
});