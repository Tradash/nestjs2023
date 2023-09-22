import { Controller, Post, UseGuards, Body } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { UserEntity } from "@app/user/user.entity";
import { User } from "@app/user/decorators/user.decorator";
import { CreateArticleDto } from "./dto/createArticle.dto";

@Controller("articles")
export class ArticleController {
    constructor(private readonly articleService: ArticleService) { }
    @Post()
    @UseGuards(AuthGuard)
    async create(@User() currentUser: UserEntity, @Body('article') createArticleDto: CreateArticleDto): Promise<any> {
        return this.articleService.createArticle(currentUser, createArticleDto)
    }
}