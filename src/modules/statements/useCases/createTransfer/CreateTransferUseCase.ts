import { inject, injectable } from "tsyringe"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { OperationType, Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { CreateTransferError } from "./CreateTransferError";

interface IRequest{
  recipient_id: string,
  sender_id: string,
  amount: number,
  description: string
}
@injectable()
class CreateTransferUseCase{
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}


  async execute({sender_id, recipient_id, amount, description}: IRequest): Promise<Statement>{
    const sender = await this.usersRepository.findById(sender_id);

    if(!sender) {
      throw new CreateTransferError.UserNotFound();
    }

    const recipient = await this.usersRepository.findById(recipient_id);

    if(!recipient) {
      throw new CreateTransferError.UserNotFound();
    }

    const senderBalance = await this.statementsRepository.getUserBalance({user_id: sender_id})

    if(senderBalance.balance < amount) {
      throw new CreateTransferError.InsufficientFunds();
    }

    await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.WITHDRAW,
      user_id: sender_id
    })

    const transfer = await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.DEPOSIT,
      user_id: recipient_id
    })

    transfer.sender_id = sender_id;

    return transfer;
  }
}

export {CreateTransferUseCase}
