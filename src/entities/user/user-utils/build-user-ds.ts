import { buildFoundArticleDS } from '../../article/utils/build-found-article-ds.js';
import { FoundUserDS } from '../data-structures/found-user.ds.js';
import { UserEntity } from '../user.entity.js';

export const buildFoundUserDS = (
  user: UserEntity,
  withArticles = true,
): FoundUserDS => {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    articles:
      withArticles && user.articles
        ? user.articles.map((article) => buildFoundArticleDS(article))
        : [],
  };
};
