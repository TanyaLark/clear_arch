import { Inject, Injectable, Scope } from '@nestjs/common';
import AbstractUseCase from '../../../common/abstract-use.case.js';
import { IDeleteUserArticles } from '../article.interface.js';
import { FoundArticleDS } from '../data-structures/found-article.ds.js';
import { IGlobalDatabaseContext } from '../../../common/application/global-database-context.interface.js';
import { BaseType } from '../../../common/data-injection.tokens.js';
import { buildFoundArticleDS } from '../utils/build-found-article-ds.js';

@Injectable({ scope: Scope.REQUEST })
export class DeleteAllUserArticlesUseCase
  extends AbstractUseCase<string, FoundArticleDS[]>
  implements IDeleteUserArticles
{
  constructor(
    @Inject(BaseType.GLOBAL_DB_CONTEXT)
    protected _dbContext: IGlobalDatabaseContext,
  ) {
    super();
  }

  protected async implementation(userId: string): Promise<FoundArticleDS[]> {
    const deleteResult =
      await this._dbContext.articleRepository.deleteAllUserArticles(userId);
    return deleteResult.map((article) => buildFoundArticleDS(article));
  }
}
