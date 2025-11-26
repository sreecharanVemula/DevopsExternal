const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../server'); // our Express app

describe('Student CRUD API', () => {
  let studentId;

  // POST - create a new student
  it('should create a new student', async () => {
    const res = await request(app)
      .post('/students')
      .send({ name: 'Alice', age: 21, course: 'CS' });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.name).to.equal('Alice');
    studentId = res.body.id;
  });

  // GET - get all students
  it('should get all students', async () => {
    const res = await request(app)
      .get('/students');

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  // PATCH - update the created student
  it('should update the student', async () => {
    const res = await request(app)
      .patch(`/students/${studentId}`)
      .send({ age: 22 });

    expect(res.status).to.equal(200);
    expect(res.body.age).to.equal(22);
  });

  // DELETE - delete the created student
  it('should delete the student', async () => {
    const res = await request(app)
      .delete(`/students/${studentId}`);

    expect(res.status).to.equal(200);
  });
});
