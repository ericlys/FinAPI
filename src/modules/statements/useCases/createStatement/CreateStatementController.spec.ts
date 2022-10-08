import request from "supertest"
import { Connection } from "typeorm"
import { app } from "../../../../app"
import { v4 as uuidV4 } from "uuid";

import createConnection from '../../../../database'
import { hash } from "bcryptjs";

let connection:Connection;
describe("Create Statement Controller", () => {

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

  it('should be create deposit', async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "teste@teste.com",
      password: "teste",
    });

    const { token } = responseToken.body;

   const response = await request(app)
   .post("/api/v1/statements/deposit")
    .send({
      amount: 900,
      description: 'deposit test'
    })
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.amount).toEqual(900)
  })

  it('should be create withdraw', async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "teste@teste.com",
      password: "teste",
    });

    const { token } = responseToken.body;

   const response = await request(app)
   .post("/api/v1/statements/withdraw")
    .send({
      amount: 500,
      description: 'withdraw test'
    })
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.amount).toEqual(500)
  })

  it("should not be able to withdraw with enough funds", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "teste@teste.com",
      password: "teste",
    });

    const { token } = responseToken.body;

   const response = await request(app)
   .post("/api/v1/statements/withdraw")
    .send({
      amount: 500,
      description: 'withdraw not founds test'
    })
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message')
  })

  it("should not be able to withdraw with user not found", async () => {

   const response = await request(app)
   .post("/api/v1/statements/withdraw")
    .send({
      amount: 500,
      description: 'withdraw not founds test'
    })
    .set({
      Authorization: `Bearer tokenInvalid`
    })

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('message')
  })
})
