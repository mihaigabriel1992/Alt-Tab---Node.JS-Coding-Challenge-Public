/* eslint-env mocha */

'use strict';

const assert = require('chai').assert;
const request = require('supertest-as-promised');

const app = require('../../app');

const user = `integration_test_${Math.floor(Date.now() / 1000)}@alttab.co`;

describe('Authentication Controller', () => {
  it('should register a new user and return token', () => {
    let token = null;

    return request(app)
      .post('/api/register')
      .send({
        email: user,
        password: 'integration',
        name: 'Integration Test',
      })
      .expect(201)
      .then((data) => {
        token = data.body.token;
        assert.ok(token);
      });
  });

  it('should login existing User', () => {
    let token = null;
    return request(app)
      .post('/api/login')
      .send({
        email: user,
        password: 'integration',
      })
      .expect(200)
      .then((data) => {
        token = data.body.token;
        assert.ok(token);
      });
  });

  it('should return an error bad request if email is used', () => request(app)
      .post('/api/register')
      .send({
        email: user,
        password: 'integration',
        name: 'Integration Test',
      })
      .expect(400));

  it('should return an error bad request if email isn\'t specified', () => request(app)
      .post('/api/register')
      .send({
        password: 'integration',
        name: 'Integration Test',
      })
      .expect(400));

  it('should return an error bad request if password isn\'t specified', () => request(app)
      .post('/api/register')
      .send({
        email: user,
        name: 'Integration Test',
      })
      .expect(400));
});

describe('Profile controller', () => {
  let token = null;

  before(() => request(app)
      .post('/api/login')
      .send({
        email: user,
        password: 'integration',
      })
      .then((data) => {
        token = data.body.token;
        assert.ok(token);
      }));

  it('should fetch the profile info of existing user', () => request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((data) => {
        assert.equal(data.body.email, user);
      }));

  it('should return an error when token is not specified', () => request(app)
      .get('/api/profile')
      .expect(401));
});
