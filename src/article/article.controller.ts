import { Controller, Post, UseGuards, Body, Get, Param, Delete, Put, UsePipes, ValidationPipe, Query } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { UserEntity } from "@app/user/user.entity";
import { User } from "@app/user/decorators/user.decorator";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { IArticleResponse } from "./types/articleResponse.interface";
import { IArticlesResponse } from "./types/articlesResponse.interface";

@Controller("articles")
export class ArticleController {
    constructor(private readonly articleService: ArticleService) { }

    @Get()
    async findAll(@User('id') currentUserId: number, @Query() query: any): Promise<IArticlesResponse> {
        return await this.articleService.findAll(currentUserId, query)
    }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async create(@User() currentUser: UserEntity, @Body('article') createArticleDto: CreateArticleDto): Promise<IArticleResponse> {
        const article = await this.articleService.createArticle(currentUser, createArticleDto)
        return this.articleService.buildArticleResponse(article)
    }

    @Get(":slug")
    async getSingleArticle(@Param('slug') slug: string): Promise<IArticleResponse> {
        const article = await this.articleService.findBySlag(slug);
        return this.articleService.buildArticleResponse(article)

    }

    @Delete(":slug")
    @UseGuards(AuthGuard)
    async deleteArticle(@User('id') currentUserId: number, @Param('slug') slug: string) {
        return await this.articleService.deleteArticle(slug, currentUserId)
    }

    @Put(":slug")
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async updateArticle(@User('id') currentUserId: number, @Param('slug') slug: string, @Body('article') updateArticleDto: CreateArticleDto): Promise<IArticleResponse> {
        const article = await this.articleService.updateArticle(slug, updateArticleDto, currentUserId)
        return this.articleService.buildArticleResponse(article)

    }

    @Post(":slug/favorite")
    @UseGuards(AuthGuard)
    async addArticleToFavorites(@User('id') currentUserId: number, @Param('slug') slug: string): Promise<IArticleResponse> {
        const article = await this.articleService.addArticleToFavorites(slug, currentUserId)
        return this.articleService.buildArticleResponse(article)
    }

}