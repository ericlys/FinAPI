import request from "supertest"
import { Connection } from "typeorm"
import { app } from "../../../../app"

import createConnection from '../../../../database'
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";

let connection:Connection;
describe("Authenticate User Controller", () => {

  beforeAll( async()=> {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll( async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('should not be able to authenticate user authenticate if user not found', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'teste@teste.com',
      password: 'teste1234'
    })

    expect(response.status).toBe(401);
  })

  it('should be able to authenticate user', async () => {

    const user:ICreateUserDTO = {
      name: 'Teste',
      email: 'teste@teste.com',
      password: 'teste1234'
    }

    await request(app).post('/api/v1/users').send(user)

    const response = await request(app).post('/api/v1/sessions').send({
      email: user.email,
      password: user.password
    })

    expect(response.body).toHaveProperty('token');
  })

  it('should not be able authenticate with user not found', async () => {

    const response = await request(app).post('/api/v1/sessions').send({
      email: 'teste123@gmail.com',
      password: 'test123'
    })

    expect(response.status).toBe(401);
  })


})
