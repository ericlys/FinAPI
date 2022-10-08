import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

describe("Get Balance", () => {

  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let getBalanceUseCase: GetBalanceUseCase;

  beforeEach(()=> {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  })

  it("should not be able get balance if the user not found", () => {
    expect(async () => {
      await getBalanceUseCase.execute({user_id: 'test'})
    }).rejects.toBeInstanceOf(AppError)
  })

  it("should be able get balance", async() => {

    const user = await inMemoryUsersRepository.create({
      name: 'Test',
      email: 'teste@teste.com',
      password: 'teste12345'
    })

    await inMemoryStatementsRepository.create({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'test deposit',
    })

    await inMemoryStatementsRepository.create({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: 'test deposit2',
    })

    const balance = await getBalanceUseCase.execute({user_id: user.id!})

    expect(balance).toMatchObject({balance: 1500})
  })
})
