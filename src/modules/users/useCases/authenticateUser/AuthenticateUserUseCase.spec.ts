import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate user", () => {

  beforeEach(()=> {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should not be able to authenticate user with non existent email", async() => {
    expect(async ()=>{
      await authenticateUserUseCase.execute({
        email: 'teste1@teste.com',
        password: 'teste123'
      });

    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate user with non existent password", async() => {
    expect(async ()=>{
      await authenticateUserUseCase.execute({
        email: 'teste1@teste.com',
        password: 'teste123'
      });

    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to authenticate an existing user", async() => {

    const user = {
      name: 'test',
      email: 'test@teste.com',
      password: 'teste123'
    }

    await createUserUseCase.execute(user)

    const response = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(response).toHaveProperty("token");
  });

});
