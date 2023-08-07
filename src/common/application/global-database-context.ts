import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { BaseType } from '../data-injection.tokens.js';
import { UserEntity } from '../../entities/user/user.entity.js';
import { IUserRepository } from '../../entities/user/repository/user.repository-extension.interface.js';
import { userCustomRepositoryExtension } from '../../entities/user/repository/user.repository.extension.js';
import { IGlobalDatabaseContext } from './global-database-context.interface.js';
import { ArticleEntity } from '../../entities/article/article.entity.js';
import { IArticleRepository } from '../../entities/article/repository/article.repository-extension.interface.js';
import { articleCustomRepositoryExtension } from '../../entities/article/repository/article.repository.extension.js';

@Injectable({ scope: Scope.REQUEST })
export class GlobalDatabaseContext implements IGlobalDatabaseContext {
  private _queryRunner: QueryRunner;

  private _userRepository: Repository<UserEntity> & IUserRepository;
  private _articleRepository: Repository<ArticleEntity> & IArticleRepository;

  public constructor(
    @Inject(BaseType.DATA_SOURCE)
    public appDataSource: DataSource,
  ) {
    this.initRepositories();
  }

  private initRepositories(): void {
    this._userRepository = this.appDataSource
      .getRepository(UserEntity)
      .extend(userCustomRepositoryExtension);
    this._articleRepository = this.appDataSource
      .getRepository(ArticleEntity)
      .extend(articleCustomRepositoryExtension);
  }

  public get userRepository(): Repository<UserEntity> & IUserRepository {
    return this._userRepository;
  }

  public get articleRepository(): Repository<ArticleEntity> &
    IArticleRepository {
    return this._articleRepository;
  }

  public startTransaction(): Promise<void> {
    this._queryRunner = this.appDataSource.createQueryRunner();
    this._queryRunner.startTransaction();
    return;
  }

  public async commitTransaction(): Promise<void> {
    if (!this._queryRunner) return;
    try {
      await this._queryRunner.commitTransaction();
    } catch (e) {
      throw e;
    } finally {
      await this._queryRunner.release();
    }
  }

  public async rollbackTransaction(): Promise<void> {
    if (!this._queryRunner) return;
    try {
      await this._queryRunner.rollbackTransaction();
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      await this._queryRunner.release();
    }
  }
}
