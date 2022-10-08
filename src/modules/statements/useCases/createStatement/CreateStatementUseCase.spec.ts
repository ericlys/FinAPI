import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import {CreateStatementUseCase} from './CreateStatementUseCase';
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let cresteStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    cresteStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it("should not be able to create an statement if the user do not exist", () => {
    const statement: ICreateStatementDTO = {
      user_id: 'test',
      amount: 1000,
      type: OperationType.WITHDRAW,
      description: 'test description'
    }

    expect( async () => {
      await cresteStatementUseCase.execute(statement)
    }).rejects.toBeInstanceOf(AppError)
  })

  it("should be able create deposit statement if have funds", async() => {
    const user = await inMemoryUsersRepository.create({
      email: 'user1@teste.com',
      name: 'teste1',
      password: 'teste123'
    });

    const depositStatement: ICreateStatementDTO = {
      user_id: user.id!,
      amount: 1000,
      type: OperationType.DEPOSIT,
      description: 'withdraw test'
    }

    const deposit = await cresteStatementUseCase.execute(depositStatement)

    expect(deposit).toMatchObject(depositStatement)
  })

  it("should not be able withdraw if insufficient funds", async() => {

    const user = await inMemoryUsersRepository.create({
      email: 'user1@teste.com',
      name: 'teste1',
      password: 'teste123'
    });

    const statement: ICreateStatementDTO = {
      user_id: user.id!,
      amount: 100,
      type: OperationType.WITHDRAW,
      description: 'withdraw test'
    }

    expect( async () => {
      await cresteStatementUseCase.execute(statement)
    }).rejects.toBeInstanceOf(AppError)
  })

  it("should be able create withdraw statement if have funds", async() => {
    const user = await inMemoryUsersRepository.create({
      email: 'user1@teste.com',
      name: 'teste1',
      password: 'teste123'
    });

    const depositStatement: ICreateStatementDTO = {
      user_id: user.id!,
      amount: 1000,
      type: OperationType.DEPOSIT,
      description: 'withdraw test'
    }

    await cresteStatementUseCase.execute(depositStatement)

    const withdrawStatement: ICreateStatementDTO = {
      user_id: user.id!,
      amount: 1000,
      type: OperationType.WITHDRAW,
      description: 'withdraw test'
    }

    const statement = await cresteStatementUseCase.execute(withdrawStatement)

    expect(statement).toHaveProperty('id')
  })
})
