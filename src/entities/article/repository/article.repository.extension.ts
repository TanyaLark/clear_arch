import { ArticleEntity } from '../article.entity.js';
import { IArticleRepository } from './article.repository-extension.interface.js';

export const articleCustomRepositoryExtension: IArticleRepository = {
  async findByTitle(title: string): Promise<ArticleEntity> {
    return await this.findOne({ where: { title } });
  },

  async getAllUserArticles(userId: string): Promise<ArticleEntity[]> {
    const qb = this.createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .where('author.id = :userId', { userId });
    return await qb.getMany();
  },

  async deleteAllUserArticles(userId: string): Promise<ArticleEntity[]> {
    const articlesToDelete = await this.getAllUserArticles(userId);
    return await this.remove(articlesToDelete);
  },
};
