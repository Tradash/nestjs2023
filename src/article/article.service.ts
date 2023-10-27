import { UserEntity } from "@app/user/user.entity";
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { ArticleEntity } from "./article.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, getRepository } from "typeorm";
import { IArticleResponse } from "./types/articleResponse.interface";
import slugify from "slugify"
import { IArticlesResponse } from "./types/articlesResponse.interface";
import dataSource from "@app/db.config";

@Injectable()
export class ArticleService {
    constructor(@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) { }

    async findAll(currentUserId: number, query: any): Promise<IArticlesResponse> {
        const queryBuilder = dataSource.getRepository(ArticleEntity).createQueryBuilder('articles').leftJoinAndSelect('articles.author', 'author');

        queryBuilder.orderBy('articles.createdAt', "DESC");

        const articlesCount = await queryBuilder.getCount()


        if (query.author) {
            const author = await this.userRepository.findOne({
                where: { username: query.author }
            });

            queryBuilder.andWhere('articles.authorId = :id', { id: author.id })
        }

        if (query.tag) {
            queryBuilder.andWhere('articles.tagList LIKE :tag', { tag: `%${query.tag}%` })
        }

        if (query.limit) {
            queryBuilder.limit(query.limit)
        }

        if (query.offset) {
            queryBuilder.offset(query.offset)
        }

        const articles = await queryBuilder.getMany()

        return { articles, articlesCount }
    }

    async createArticle(currentUser: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
        const article = new ArticleEntity()
        Object.assign(article, createArticleDto)

        if (!article.tagList) {
            article.tagList = []
        }

        article.slug = this.getSlug(createArticleDto.title)

        article.author = currentUser

        return await this.articleRepository.save(article)
    }

    async addArticleToFavorites(slug: string, currentUserId: number): Promise<ArticleEntity> {
        const article = await this.findBySlag(slug);
        const user = await this.userRepository.findOne({ where: { id: currentUserId }, relations: ['favorites'] })

        const isNotFavorited = user.favorites.findIndex((articleInFavorites) => articleInFavorites.id === article.id) === -1

        if (isNotFavorited) {
            user.favorites.push(article)
            article.favoriteCount++
            await this.userRepository.save(user)
            await this.articleRepository.save(article)
        }

        return article;
    }

    buildArticleResponse(article: ArticleEntity): IArticleResponse {
        return { article }
    }

    private getSlug(title: string): string {
        return slugify(title, { lower: true }) + "-" + ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    }

    async findBySlag(slug: string): Promise<ArticleEntity> {
        return await this.articleRepository.findOne({ where: { slug } })
    }

    async deleteArticle(slug: string, currentUserId: number): Promise<DeleteResult> {
        const article = await this.findBySlag(slug)

        if (!article) {
            throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND)
        }

        if (article.author.id !== currentUserId) {
            throw new HttpException('You are not anauthor', HttpStatus.FORBIDDEN)
        }
        return await this.articleRepository.delete({ slug })

    }

    async updateArticle(slug: string, updateArticleDto: CreateArticleDto, currentUserId: number): Promise<ArticleEntity> {
        const article = await this.findBySlag(slug)

        if (!article) {
            throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
        }

        if (article.author.id !== currentUserId) {
            throw new HttpException('You are not an author', HttpStatus.FORBIDDEN)
        }

        Object.assign(article, updateArticleDto)

        return await this.articleRepository.save(article)
    }

}