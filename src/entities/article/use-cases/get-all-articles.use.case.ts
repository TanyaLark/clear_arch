import { Inject, Injectable, Scope } from '@nestjs/common';
import AbstractUseCase from '../../../common/abstract-use.case.js';
import { FoundArticleDS } from '../data-structures/found-article.ds.js';
import { IGetAllArticles } from '../article.interface.js';
import { buildFoundArticleDS } from '../utils/build-found-article-ds.js';
import { BaseType } from '../../../common/data-injection.tokens.js';
import { IGlobalDatabaseContext } from '../../../common/application/global-database-context.interface.js';

@Injectable({ scope: Scope.REQUEST })
export class GetAllArticlesUseCase
  extends AbstractUseCase<undefined, FoundArticleDS[]>
  implements IGetAllArticles
{
  constructor(
    @Inject(BaseType.GLOBAL_DB_CONTEXT)
    protected _dbContext: IGlobalDatabaseContext,
  ) {
    super();
  }

  protected async implementation(): Promise<FoundArticleDS[]> {
    const foundArticles = await this._dbContext.articleRepository.find();
    return foundArticles.map((article) => buildFoundArticleDS(article));
  }
}
