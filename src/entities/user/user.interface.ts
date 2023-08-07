import { InTransaction } from '../../common/in-transaction.enum.js';
import { FoundUserDS } from './data-structures/found-user.ds.js';
import { RegisterUserDS } from './data-structures/register-user.ds.js';

export interface IGetUsers {
  execute(inTransaction?: InTransaction): Promise<FoundUserDS[]>;
}

export interface IGetUserByEmail {
  execute(email: string, inTransaction?: InTransaction): Promise<FoundUserDS>;
}

export interface IRegisterUser {
  execute(
    userData: RegisterUserDS,
    inTransaction?: InTransaction,
  ): Promise<FoundUserDS>;
}
