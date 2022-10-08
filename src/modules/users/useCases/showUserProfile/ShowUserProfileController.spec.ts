import request from "supertest"
import { Connection } from "typeorm"
import { app } from "../../../../app"
import { v4 as uuidV4 } from "uuid";

import createConnection from '../../../../database'
import { hash } from "bcryptjs";

let connection:Connection;
describe("Show User Profile Controller", () => {

  beforeAll( async()=> {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("teste", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
        values('${id}', 'teste', 'teste@teste.com', '${password}', 'now()', 'now()')
      `
    );
  })

  afterAll( async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('should be able to show user profile', async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "teste@teste.com",
      password: "teste",
    });

    const { token } = responseToken.body;

    const response = await request(app).get('/api/v1/profile')
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toEqual('teste');
  })

  it('should not be able to show profile if user not found', async () => {

    const response = await request(app).get('/api/v1/profile')
    .set({
      Authorization: `Bearer token teste`
    })

    expect(response.body).toHaveProperty('message');
    expect(response.status).toBe(401);
  })
})
