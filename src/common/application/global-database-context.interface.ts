import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user/user.entity.js';
import { IUserRepository } from '../../entities/user/repository/user.repository-extension.interface.js';
import { ArticleEntity } from '../../entities/article/article.entity.js';
import { IArticleRepository } from '../../entities/article/repository/article.repository-extension.interface.js';
import { IDatabaseContext } from '../database-context.interface.js';

export interface IGlobalDatabaseContext extends IDatabaseContext {
  userRepository: Repository<UserEntity> & IUserRepository;

  articleRepository: Repository<ArticleEntity> & IArticleRepository;
}
