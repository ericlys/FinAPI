import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create user", () => {

  beforeEach(()=> {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to create a new user", async() => {
    const user = {
      name: 'Test',
      email: 'test@test.com',
      password: 'test123'
    }

    const userCreated = await createUserUseCase.execute(user);

    expect(userCreated).toHaveProperty("id");
  });

  it("should not be able to create a new user with existing email", async() => {
    expect(async()=> {
    const user = {
      name: 'Test',
      email: 'test@test.com',
      password: 'test123'
    }

    await createUserUseCase.execute(user);
    await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(AppError)
  });


});
