import request from "supertest"
import { Connection } from "typeorm"
import { app } from "../../../../app"
import { v4 as uuidV4 } from "uuid";

import createConnection from '../../../../database'
import { hash } from "bcryptjs";

let connection:Connection;
describe("Get Statement Operation Controller", () => {

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

  it('should be able to get statement operation', async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "teste@teste.com",
      password: "teste",
    });

    const { token } = responseToken.body;

    const depositStatement = await request(app)
    .post("/api/v1/statements/deposit")
    .send({
      amount: 500,
      description: 'deposit test'
    })
    .set({
      Authorization: `Bearer ${token}`
    })

    const response = await request(app)
    .get(`/api/v1/statements/${depositStatement.body.id}`)
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.body).toHaveProperty('id');
    expect(response.status).toBe(200);

  })

  it('should not be able to get statement operation with user not found', async () => {
    const response = await request(app)
    .get(`/api/v1/statements/teste`)
    .set({
      Authorization: `Bearer teste`
    })

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  })

  it('should not be able to get statement operation with user not found', async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "teste@teste.com",
      password: "teste",
    });

    const { token } = responseToken.body;

   const response = await request(app)
    .get(`/api/v1/statements/teste`)
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(500);
  })
})
