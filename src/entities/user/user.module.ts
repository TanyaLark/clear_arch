import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity.js';
import { UserController } from './user.controller.js';
import { ArticleEntity } from '../article/article.entity.js';
import { BaseType, UseCaseType } from '../../common/data-injection.tokens.js';
import { GlobalDatabaseContext } from '../../common/application/global-database-context.js';
import { GetAllUsersUseCase } from './use-cases/get-all-users.use.case.js';
import { GetUserByEmailUseCase } from './use-cases/get-user-by-email.use.case.js';
import { RegisterUserCase } from './use-cases/register-user.use.case.js';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ArticleEntity])],
  controllers: [UserController],
  providers: [
    {
      provide: BaseType.GLOBAL_DB_CONTEXT,
      useClass: GlobalDatabaseContext,
    },
    {
      provide: UseCaseType.GET_ALL_USERS,
      useClass: GetAllUsersUseCase,
    },
    {
      provide: UseCaseType.GET_USER_BY_EMAIL,
      useClass: GetUserByEmailUseCase,
    },
    {
      provide: UseCaseType.REGISTER_USER,
      useClass: RegisterUserCase,
    },
  ],
  exports: [],
})
export class UserModule {}
