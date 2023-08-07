import { FoundArticleDS } from '../../article/data-structures/found-article.ds.js';

export class FoundUserDS {
  id: string;
  email: string;
  createdAt: Date;
  articles: FoundArticleDS[];
}
