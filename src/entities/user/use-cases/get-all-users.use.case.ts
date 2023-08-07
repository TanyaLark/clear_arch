import { Inject, Injectable, Scope } from '@nestjs/common';
import AbstractUseCase from '../../../common/abstract-use.case.js';
import { FoundUserDS } from '../data-structures/found-user.ds.js';
import { IGetUsers } from '../user.interface.js';
import { IGlobalDatabaseContext } from '../../../common/application/global-database-context.interface.js';
import { BaseType } from '../../../common/data-injection.tokens.js';
import { buildFoundUserDS } from '../user-utils/build-user-ds.js';

@Injectable({ scope: Scope.REQUEST })
export class GetAllUsersUseCase
  extends AbstractUseCase<undefined, FoundUserDS[]>
  implements IGetUsers
{
  constructor(
    @Inject(BaseType.GLOBAL_DB_CONTEXT)
    protected _dbContext: IGlobalDatabaseContext,
  ) {
    super();
  }

  protected async implementation(): Promise<FoundUserDS[]> {
    const foundUsers = await this._dbContext.userRepository.find();
    return foundUsers.map((user) => buildFoundUserDS(user));
  }
}
