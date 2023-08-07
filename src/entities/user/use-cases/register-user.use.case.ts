import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import AbstractUseCase from '../../../common/abstract-use.case.js';
import { IGlobalDatabaseContext } from '../../../common/application/global-database-context.interface.js';
import { BaseType } from '../../../common/data-injection.tokens.js';
import { FoundUserDS } from '../data-structures/found-user.ds.js';
import { RegisterUserDS } from '../data-structures/register-user.ds.js';
import { IRegisterUser } from '../user.interface.js';
import { UserEntity } from '../user.entity.js';
import { buildFoundUserDS } from '../user-utils/build-user-ds.js';
import { ArticleEntity } from '../../article/article.entity.js';

@Injectable({ scope: Scope.REQUEST })
export class RegisterUserCase
  extends AbstractUseCase<RegisterUserDS, FoundUserDS>
  implements IRegisterUser
{
  constructor(
    @Inject(BaseType.GLOBAL_DB_CONTEXT)
    protected _dbContext: IGlobalDatabaseContext,
  ) {
    super();
  }

  protected async implementation(
    userData: RegisterUserDS,
  ): Promise<FoundUserDS> {
    const { email, password } = userData;
    const foundUser = await this._dbContext.userRepository.findByEmail(email);

    if (foundUser) {
      throw new HttpException(
        {
          message: 'User already exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = new UserEntity();
    newUser.email = email;
    newUser.password = password;
    const savedUser = await this._dbContext.userRepository.save(newUser);

    const newWelcomeArticle = new ArticleEntity();
    newWelcomeArticle.title = 'Welcome to my blog!';
    newWelcomeArticle.body = 'This is your first article!';
    newWelcomeArticle.author = savedUser;
    await this._dbContext.articleRepository.save(newWelcomeArticle);

    return buildFoundUserDS(savedUser);
  }
}
