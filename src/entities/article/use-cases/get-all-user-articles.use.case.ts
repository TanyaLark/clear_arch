import { Inject, Injectable, Scope } from '@nestjs/common';
import AbstractUseCase from '../../../common/abstract-use.case.js';
import { IGetUserArticles } from '../article.interface.js';
import { FoundArticleDS } from '../data-structures/found-article.ds.js';
import { IGlobalDatabaseContext } from '../../../common/application/global-database-context.interface.js';
import { BaseType } from '../../../common/data-injection.tokens.js';
import { buildFoundArticleDS } from '../utils/build-found-article-ds.js';

@Injectable({ scope: Scope.REQUEST })
export class GetAllUserArticlesUseCase
  extends AbstractUseCase<string, FoundArticleDS[]>
  implements IGetUserArticles
{
  constructor(
    @Inject(BaseType.GLOBAL_DB_CONTEXT)
    protected _dbContext: IGlobalDatabaseContext,
  ) {
    super();
  }

  protected async implementation(userId: string): Promise<FoundArticleDS[]> {
    const foundArticles =
      await this._dbContext.articleRepository.getAllUserArticles(userId);
    return foundArticles.map((article) => buildFoundArticleDS(article));
  }
}
