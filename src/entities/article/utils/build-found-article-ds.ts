import { buildFoundUserDS } from '../../user/user-utils/build-user-ds.js';
import { ArticleEntity } from '../article.entity.js';
import { FoundArticleDS } from '../data-structures/found-article.ds.js';

export const buildFoundArticleDS = (article: ArticleEntity): FoundArticleDS => {
  return {
    id: article.id,
    title: article.title,
    body: article.body,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    author: article.author ? buildFoundUserDS(article.author, false) : null,
  };
};
