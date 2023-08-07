import { Module } from '@nestjs/common';
import { ArticleEntity } from './article.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller.js';
import { UserEntity } from '../user/user.entity.js';
import { GlobalDatabaseContext } from '../../common/application/global-database-context.js';
import { BaseType, UseCaseType } from '../../common/data-injection.tokens.js';
import { GetAllArticlesUseCase } from './use-cases/get-all-articles.use.case.js';
import { DeleteAllUserArticlesUseCase } from './use-cases/delete-all-user-articles.use.case.js';
import { GetAllUserArticlesUseCase } from './use-cases/get-all-user-articles.use.case.js';
import { CreateNewArticleUseCase } from './use-cases/create-new-article.use.case.js';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity])],
  controllers: [ArticleController],
  providers: [
    {
      provide: BaseType.GLOBAL_DB_CONTEXT,
      useClass: GlobalDatabaseContext,
    },
    {
      provide: UseCaseType.GET_ALL_ARTICLES,
      useClass: GetAllArticlesUseCase,
    },
    {
      provide: UseCaseType.DELETE_USER_ARTICLES,
      useClass: DeleteAllUserArticlesUseCase,
    },
    {
      provide: UseCaseType.GET_USER_ARTICLES,
      useClass: GetAllUserArticlesUseCase,
    },
    {
      provide: UseCaseType.CREATE_NEW_ARTICLE,
      useClass: CreateNewArticleUseCase,
    },
  ],
  exports: [],
})
export class ArticleModule {}
