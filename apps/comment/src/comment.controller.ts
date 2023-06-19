import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AccessTokenGuard, CreateCommentDto, Roles, RolesGuard, UpdateCommentDto, WriteCommentDto } from '@app/common';
import { MessagePattern } from '@nestjs/microservices';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiOkResponse,
    ApiBody,
} from '@nestjs/swagger';
import { Request } from 'express';

@Controller('/comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @MessagePattern({cmd: 'comment'})
    async addComments(dtos: CreateCommentDto[]) {
        const result = await this.commentService.createMany(dtos);
        return result;
    }

    @ApiOperation({ summary: 'Создание комментария' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Комментарий успешно создан' })
    @ApiBody({
        type: WriteCommentDto,
            examples: {
                example1: {
                value: {
                    type: "POSITIVE",
                    title: "test",
                    description: "test",
                    repliedOnComment: 666,
                },
                summary: 'Пример создания комментария',
                },
            },
    })
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('USER')
    @Post('/:movieId')
    async createComment(@Req() req: Request, @Param('movieId') movieId: number, @Body() dto: WriteCommentDto) {
        const userId = req.user['sub'];
        const name = req.user['login'];
        const result = await this.commentService.create(dto, movieId, name, userId);
        return result;
    }

    @ApiOperation({ summary: 'Получение комментариев по ID фильма (древовидная структура)' })
    @ApiOkResponse({ description: 'Комментарии успешно получены' })
    @Get('/:movieId/tree')
    async getCommentsByMovieIdTree(@Param('movieId') movieId: number) {
        const result = await this.commentService.getCommentsTree(movieId);
        return result;
    }

    @ApiOperation({ summary: 'Получение комментариев по ID фильма (плоская структура)' })
    @ApiOkResponse({ description: 'Комментарии успешно получены' })
    @Get('/:movieId/flat')
    async getCommentsByMovieIdFlat(@Param('movieId') movieId: number) {
        const result = await this.commentService.getCommentsFlat(movieId);
        return result;
    }

    @ApiOperation({ summary: 'Получение комментаря по ID' })
    @ApiOkResponse({ description: 'Комментарий успешно получен' })
    @Get('/comment/:commentId')
    async getComment(@Param('commentId') commentId: number) {
        const result = await this.commentService.getComment(commentId);
        return result;
    }

    @ApiOperation({ summary: 'Обновление комментария' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Комментарий успешно обновлен' })
    @ApiBody({
        type: UpdateCommentDto,
            examples: {
                example1: {
                value: {
                    type: "POSITIVE",
                    title: "test",
                    description: "test",
                },
                summary: 'Пример обновления комментария',
                },
            },
    })
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('USER')
    @Put('/comment/:commentId')
    async updateComment(@Req() req: Request, @Param('commentId') commentId: number, @Body() dto: UpdateCommentDto) {
        const userId = req.user['sub'];
        const result = await this.commentService.update(userId, commentId, dto);
        return result;
    }
}
