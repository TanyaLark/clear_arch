import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Injectable,
  Param,
  Post,
} from '@nestjs/common';
import { ArticleEntity } from './article.entity.js';
import { UseCaseType } from '../../common/data-injection.tokens.js';
import {
  ICreateNewArticle,
  IDeleteUserArticles,
  IGetAllArticles,
  IGetUserArticles,
} from './article.interface.js';
import { FoundArticleDS } from './data-structures/found-article.ds.js';

@Injectable()
@Controller('article')
export class ArticleController {
  constructor(
    @Inject(UseCaseType.GET_ALL_ARTICLES)
    private readonly getAllArticlesUseCase: IGetAllArticles,
    @Inject(UseCaseType.DELETE_USER_ARTICLES)
    private readonly deleteUserArticlesUseCase: IDeleteUserArticles,
    @Inject(UseCaseType.GET_USER_ARTICLES)
    private readonly getUserArticlesUseCase: IGetUserArticles,
    @Inject(UseCaseType.CREATE_NEW_ARTICLE)
    private readonly createNewArticleUseCase: ICreateNewArticle,
  ) {}

  @Get('/all/')
  async getAll(): Promise<FoundArticleDS[]> {
    return this.getAllArticlesUseCase.execute();
  }

  @Delete('/:userId')
  async deleteAllUserArticles(
    @Param('userId') userId: string,
  ): Promise<FoundArticleDS[]> {
    return await this.deleteUserArticlesUseCase.execute(userId);
  }

  @Get('/user/:userId')
  async getOneUserArticle(
    @Param('userId') userId: string,
  ): Promise<FoundArticleDS[]> {
    return this.getUserArticlesUseCase.execute(userId);
  }

  @Post('/create/:userId')
  async createNewArticle(
    @Body('title') articleTitle: string,
    @Body('body') articleBody: string,
    @Param('userId') userId: string,
  ): Promise<FoundArticleDS> {
    return this.createNewArticleUseCase.execute({
      userId,
      articleTitle,
      articleBody,
    });
  }
}
