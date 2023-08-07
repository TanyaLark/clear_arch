import {
  Injectable,
  Scope,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import AbstractUseCase from '../../../common/abstract-use.case.js';
import { IGlobalDatabaseContext } from '../../../common/application/global-database-context.interface.js';
import { BaseType } from '../../../common/data-injection.tokens.js';
import { ICreateNewArticle } from '../article.interface.js';
import { FoundArticleDS } from '../data-structures/found-article.ds.js';
import { CreateArticleDS } from '../data-structures/create-article.ds.js';
import { ArticleEntity } from '../article.entity.js';
import { buildFoundArticleDS } from '../utils/build-found-article-ds.js';

@Injectable({ scope: Scope.REQUEST })
export class CreateNewArticleUseCase
  extends AbstractUseCase<CreateArticleDS, FoundArticleDS>
  implements ICreateNewArticle
{
  constructor(
    @Inject(BaseType.GLOBAL_DB_CONTEXT)
    protected _dbContext: IGlobalDatabaseContext,
  ) {
    super();
  }

  protected async implementation(
    articleData: CreateArticleDS,
  ): Promise<FoundArticleDS> {
    const { userId, articleTitle, articleBody } = articleData;
    const foundUser = await this._dbContext.userRepository.findFullEntityById(
      userId,
    );
    if (!foundUser) {
      throw new HttpException(
        {
          message: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const newArticle = new ArticleEntity();
    newArticle.title = articleTitle;
    newArticle.body = articleBody;
    newArticle.author = foundUser;
    const savedArticle = await this._dbContext.articleRepository.save(
      newArticle,
    );
    return buildFoundArticleDS(savedArticle);
  }
}
