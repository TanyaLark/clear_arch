import { InTransaction } from '../../common/in-transaction.enum.js';
import { CreateArticleDS } from './data-structures/create-article.ds.js';
import { FoundArticleDS } from './data-structures/found-article.ds.js';

export interface IGetAllArticles {
  execute(inTransaction?: InTransaction): Promise<FoundArticleDS[]>;
}

export interface IDeleteUserArticles {
  execute(
    userId: string,
    inTransaction?: InTransaction,
  ): Promise<FoundArticleDS[]>;
}

export interface IGetUserArticles {
  execute(
    userId: string,
    inTransaction?: InTransaction,
  ): Promise<FoundArticleDS[]>;
}

export interface ICreateNewArticle {
  execute(articleData: CreateArticleDS): Promise<FoundArticleDS>;
}
