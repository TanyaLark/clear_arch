import {
  Injectable,
  Controller,
  Get,
  Param,
  Post,
  Body,
  Inject,
} from '@nestjs/common';
import { UseCaseType } from '../../common/data-injection.tokens.js';
import { IGetUserByEmail, IGetUsers, IRegisterUser } from './user.interface.js';
import { FoundUserDS } from './data-structures/found-user.ds.js';
import { InTransaction } from '../../common/in-transaction.enum.js';

@Injectable()
@Controller('user')
export class UserController {
  constructor(
    @Inject(UseCaseType.GET_ALL_USERS)
    private readonly getAllUsersUseCase: IGetUsers,
    @Inject(UseCaseType.GET_USER_BY_EMAIL)
    private readonly getUserByEmailUseCase: IGetUserByEmail,
    @Inject(UseCaseType.REGISTER_USER)
    private readonly registerUserUseCase: IRegisterUser,
  ) {}

  @Get('/all')
  async getAll(): Promise<FoundUserDS[]> {
    return this.getAllUsersUseCase.execute();
  }

  @Get('/email/:email')
  async getByEmail(@Param('email') email: string): Promise<FoundUserDS> {
    return this.getUserByEmailUseCase.execute(email);
  }

  @Post('/register')
  async registerUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<FoundUserDS> {
    return this.registerUserUseCase.execute(
      { email, password },
      InTransaction.ON,
    );
  }
}
