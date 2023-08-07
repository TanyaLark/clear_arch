import { FoundUserDS } from '../../user/data-structures/found-user.ds.js';

export class FoundArticleDS {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  author: FoundUserDS;
}
