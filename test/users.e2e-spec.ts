import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import * as request from 'supertest';

const app = 'http://localhost:3000';

let token: string;
describe('Login user', () => {
  const user = {
    userName: 'admin',
    password: 'pass1',
  };
  it('When userName and password provided, expect to login and receive access and refresh token in response', async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send(user)
      .expect(201);

    expect(loginResponse.body).toHaveProperty('accessToken');
    expect(loginResponse.body).toHaveProperty('refreshToken');
    expect(typeof loginResponse.body.accessToken).toBe('string');
    expect(typeof loginResponse.body.refreshToken).toBe('string');
    token = loginResponse.body.accessToken;
  });

  it('Should return http status 403, provided wrong password', async () => {
    await request(app)
      .post('/auth/login')
      .send({ ...user, password: 'aaaaa' })
      .expect(403);
  });
});

describe('User route', () => {
  const id = 1;
  describe('Get user by id', () => {
    it('When user id and access token provided, expect to return user', async () => {
      const res = await request(app)
        .get(`/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email');
      expect(res.body).toHaveProperty('userName');
      expect(res.body).toHaveProperty('firstName');
      expect(res.body).toHaveProperty('lastName');
      expect(res.body).toHaveProperty('role');
      expect(res.body).toHaveProperty('isEmailConfirmed');
    });
  });

  describe('HandleUserUpdate', () => {
    it('Should update and return user, userDto, id and token provided', async () => {
      const userDto: UpdateUserDto = {
        userName: 'admin',
        firstName: 'first name',
        lastName: 'last name',
      };
      const res = await request(app)
        .put(`/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(userDto)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toMatchObject(userDto);
    });
  });
});
