import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


describe("Get Statement", () => {

  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let getStatementOperationUseCase: GetStatementOperationUseCase;

  beforeEach(()=> {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it("should not be able get statement if the user not found", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: 'test',
        statement_id: 'testStatement'
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("should not be able get statement if the statement not found", async() => {
    const user = await inMemoryUsersRepository.create({
      name: 'Test',
      email: 'teste@teste.com',
      password: 'teste12345'
    })

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id:  user.id!,
        statement_id: 'teste'
      })
   }).rejects.toBeInstanceOf(AppError)
  })

  it("should not be able get statement if the statement not found", async() => {
    const user = await inMemoryUsersRepository.create({
      name: 'Test',
      email: 'teste@teste.com',
      password: 'teste12345'
    })

    const statement = await inMemoryStatementsRepository.create({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'test deposit',
    })

    const getStatement = await getStatementOperationUseCase.execute({
      user_id:  user.id!,
      statement_id: statement.id!
    })

    expect(getStatement).toMatchObject({id: statement.id, user_id: user.id})
  })
})
