import { ArticleEntity } from '../article.entity.js';

export interface IArticleRepository {
  findByTitle(title: string): Promise<ArticleEntity>;

  getAllUserArticles(userId: string): Promise<ArticleEntity[]>;

  deleteAllUserArticles(userId: string): Promise<ArticleEntity[]>;
}
