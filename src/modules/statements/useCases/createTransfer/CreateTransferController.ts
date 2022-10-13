import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

class CreateTransferController{
  async execute(request: Request, response: Response): Promise<Response>{
    const {user_id} = request.params;
    const { amount, description } = request.body;
    const { id } = request.user;

    const createTransferUseCase = container.resolve(CreateTransferUseCase);

    const transfer = await createTransferUseCase.execute({
      recipient_id: user_id,
      sender_id: id,
      amount,
      description
    })

    return response.status(201).json(transfer)
  }
}

export {CreateTransferController}
