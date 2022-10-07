
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
describe("Show user", ()=> {
  beforeEach(()=> {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase= new ShowUserProfileUseCase(inMemoryUsersRepository);
  })

  it("should be able to display user data", async()=> {
    const user = await inMemoryUsersRepository.create({
      name: 'test',
      email: 'test@test.com',
      password: 'test1234'
    })

    const showUser = await showUserProfileUseCase.execute(user.id!)

    expect(showUser).toEqual(user)
  })

  it("should not be able to display user data if it doesn't exist", async()=> {
    expect( async()=>{
      await showUserProfileUseCase.execute('test')
    }).rejects.toBeInstanceOf(AppError)
  })
})
