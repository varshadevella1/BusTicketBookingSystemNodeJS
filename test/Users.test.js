import request from 'supertest';
import { app } from '../index.js'
describe('Register API', () => {
    test('Should register a new User', async () => {
        const res = await request(app)
            .post('http://localhost:2000/register')
            .send({
                username: 'Varsha',
                email: 'varsha.devalla@gmail.com',
                password: 'varsha@1',
                phoneNumber: '6305340692'
            });
        expect(res.statusCode).toEqual(201);
    });
    test('should not register a new user with missing fields', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'Varsha',
                email: 'varsha.devalla@gmail.com'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    test('should not register a new user with invalid email', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'Varsha',
                email: 'varsha.devalla@gmail.com',
                password: 'varsha@1'
            })
        expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
      });
    
      test('should not register a new user with weak password', async () => {
            const res = await request(app)
            .post('/register')
                end({
                username: 'Varsha',
                email: 'varsha.devalla@gmail.com',
                password: 123,
            })
    
    expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
  })
})