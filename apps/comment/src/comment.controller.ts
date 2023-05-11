import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AccessTokenGuard, CreateCommentDto, Roles, RolesGuard, UpdateCommentDto, WriteCommentDto } from '@app/common';
import { MessagePattern } from '@nestjs/microservices';
import { Request } from 'express';

@Controller('/comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @MessagePattern({cmd: 'comment'})
    async addComments(dtos: CreateCommentDto[]) {
        const result = await this.commentService.createMany(dtos);
        return result;
    }

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('USER')
    @Post('/:movieId')
    async createComment(@Req() req: Request, @Param('movieId') movieId: number, @Body() dto: WriteCommentDto) {
        const userId = req.user['sub'];
        const name = req.user['login'];
        const result = await this.commentService.create(dto, movieId, name, userId);
        return result;
    }

    @Get('/:movieId/tree')
    async getCommentsByMovieIdTree(@Param('movieId') movieId: number) {
        const result = await this.commentService.getCommentsTree(movieId);
        return result;
    }

    @Get('/:movieId/flat')
    async getCommentsByMovieIdFlat(@Param('movieId') movieId: number) {
        const result = await this.commentService.getCommentsFlat(movieId);
        return result;
    }

    @Get('/comment/:commentId')
    async getComment(@Param('commentId') commentId: number) {
        const result = await this.commentService.getComment(commentId);
        return result;
    }

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('USER')
    @Put('/comment/:commentId')
    async updateComment(@Req() req: Request, @Param('commentId') commentId: number, @Body() dto: UpdateCommentDto) {
        const userId = req.user['sub'];
        const result = await this.commentService.update(userId, commentId, dto);
        return result;
    }
}
